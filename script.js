// Charger les options de pizza et les combos à partir du fichier JSON
fetch('pizza-data.json')
    .then(response => response.json())
    .then(data => {
        initializePizzaMatrix(data.pizzaOptions); // Initialiser la matrice de sélection de pizza avec les options
        createPizzaList(data.pizzaCombos); // Créer la liste des pizzas disponibles
    })
    .catch(error => console.error('Erreur lors du chargement des données de pizza :', error));

// Fonction pour initialiser la matrice de sélection de pizza
function initializePizzaMatrix(pizzaOptions) {
    const tableHeaders = document.getElementById('tableHeaders');
    const tableBody = document.getElementById('tableBody');
    
    // Ajouter les en-têtes de colonnes (Pâte, Sauce, Toppings)
    Object.keys(pizzaOptions).forEach(option => {
        const th = document.createElement('th');
        th.textContent = option.charAt(0).toUpperCase() + option.slice(1); // Mettre la première lettre en majuscule
        tableHeaders.appendChild(th);
    });

    // Générer les lignes pour les options disponibles
    const maxOptions = Math.max(...Object.values(pizzaOptions).map(opt => Array.isArray(opt) ? opt.length : 0));
    for (let i = 0; i < maxOptions; i++) {
        const tr = document.createElement('tr');
        Object.values(pizzaOptions).forEach((options, index) => {
            const td = document.createElement('td');
            if (Array.isArray(options) && options[i]) {
                td.textContent = options[i];
                tr.appendChild(td);
            }
        });
        tableBody.appendChild(tr);
    }
}

// Fonction pour créer la liste des pizzas disponibles
function createPizzaList(pizzaCombos) {
    const pizzaList = document.getElementById('pizzaList');

    Object.keys(pizzaCombos).forEach(combo => {
        const li = document.createElement('li');
        li.textContent = pizzaCombos[combo];
        li.addEventListener('click', () => highlightPizzaCombo(combo));
        pizzaList.appendChild(li);
    });
}

// Fonction pour mettre en surbrillance les éléments correspondant à une pizza sélectionnée
function highlightPizzaCombo(combo) {
    const pizzaTable = document.getElementById('pizzaTable');
    const allCells = pizzaTable.getElementsByTagName('td');
    
    // Réinitialiser toutes les cellules
    Array.from(allCells).forEach(cell => {
        cell.classList.remove('selected');
    });

    // Sélectionner les cellules correspondant au combo de pizza
    const comboParts = combo.split('-');
    comboParts.forEach((part, index) => {
        const category = Object.keys(pizzaData.pizzaOptions)[index];
        const columnIndex = Object.keys(pizzaData.pizzaOptions).indexOf(category);
        const rowIndex = pizzaData.pizzaOptions[category].indexOf(part);
        
        if (rowIndex !== -1) {
            const cell = pizzaTable.rows[rowIndex].cells[columnIndex];
            cell.classList.add('selected');
        }
    });

    // Afficher le nom de la pizza sélectionnée
    document.getElementById("pizzaName").innerText = pizzaData.pizzaCombos[combo] || "Pizza inconnue";
}
