// Charger les options de pizza et les combos à partir du fichier JSON
fetch('pizza-data.json')
    .then(response => response.json())
    .then(data => {
        initializePizzaMatrix(data.pizzaOptions); // Initialiser la matrice de sélection de pizza avec les options
        initializePizzaList(data.pizzaCombos); // Initialiser la liste des pizzas disponibles
        window.pizzaCombos = data.pizzaCombos; // Assigner les combos de pizza à une variable globale
    })
    .catch(error => console.error('Erreur lors du chargement des données de pizza :', error));

// Fonction pour initialiser la matrice de sélection de pizza avec les données JSON
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
                // Ajouter un événement onclick pour sélectionner l'option
                td.addEventListener('click', () => selectOption(Object.keys(pizzaOptions)[index], options[i], td));
            }
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    }
}

// Fonction pour initialiser la liste des pizzas disponibles
function initializePizzaList(pizzaCombos) {
    const pizzaList = document.getElementById('pizzaList');

    // Générer les éléments de la liste des pizzas disponibles
    Object.keys(pizzaCombos).forEach(combo => {
        const li = document.createElement('li');
        li.textContent = pizzaCombos[combo];
        li.addEventListener('click', () => highlightPizzaCombo(combo));
        pizzaList.appendChild(li);
    });
}

// Fonction pour mettre en surbrillance les ingrédients correspondant à une pizza sélectionnée
function highlightPizzaCombo(combo) {
    const [pate, sauce, toppings] = combo.split('-');

    // Désélectionner toutes les cellules précédemment sélectionnées
    const selectedCells = document.querySelectorAll('.selected');
    selectedCells.forEach(cell => cell.classList.remove('selected'));

    // Sélectionner les cellules correspondant à la pizza sélectionnée
    const cells = document.querySelectorAll('td');
    cells.forEach(cell => {
        if (cell.textContent === pate || cell.textContent === sauce || cell.textContent === toppings) {
            cell.classList.add('selected');
        }
    });

    // Afficher le nom de la pizza sélectionnée dans la section des résultats
    document.getElementById('pizzaName').textContent = window.pizzaCombos[combo];
}

// Fonction pour sélectionner une option dans le tableau de sélection
function selectOption(category, value, element) {
    // Désélectionner la sélection précédente dans la même catégorie
    const prevSelected = document.querySelector(`.selected[data-category="${category}"]`);
    if (prevSelected) {
        prevSelected.classList.remove('selected');
        prevSelected.removeAttribute('data-category');
    }
    // Sélectionner la nouvelle option
    element.classList.add('selected');
    element.setAttribute('data-category', category);

    // Mettre à jour le nom de la pizza en fonction des sélections
    updatePizzaName();
}

// Fonction pour mettre à jour le nom de la pizza en fonction des sélections
function updatePizzaName() {
    const selectedOptions = {
        pate: document.querySelector('td.selected[data-category="pate"]')?.textContent,
        sauce: document.querySelector('td.selected[data-category="sauce"]')?.textContent,
        toppings: document.querySelector('td.selected[data-category="toppings"]')?.textContent
    };

    const combo = `${selectedOptions.pate}-${selectedOptions.sauce}-${selectedOptions.toppings}`;
    const pizzaName = window.pizzaCombos[combo] || "Pizza inconnue";

    document.getElementById('pizzaName').textContent = pizzaName;
}
