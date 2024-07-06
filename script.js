// Charger les options de pizza et les combos à partir du fichier JSON
fetch('pizza-data.json')
    .then(response => response.json())
    .then(data => {
        initializePizzaMatrix(data.pizzaOptions); // Initialiser la matrice de sélection de pizza avec les options
        window.pizzaCombos = data.pizzaCombos; // Assigner les combos de pizza à une variable globale

        // Ajouter les pizzas disponibles à la liste
        const pizzaList = document.getElementById('pizzaList');
        Object.values(data.pizzaCombos).forEach(pizzaName => {
            const li = document.createElement('li');
            li.textContent = pizzaName;
            li.classList.add('pizza-list-item');
            li.addEventListener('click', () => highlightPizza(pizzaName));
            pizzaList.appendChild(li);
        });
    })
    .catch(error => console.error('Erreur lors du chargement des données de pizza :', error));

// Fonction pour mettre en surbrillance les ingrédients de la pizza sélectionnée dans le tableau
function highlightPizza(pizzaName) {
    const combo = Object.entries(window.pizzaCombos).find(([key, value]) => value === pizzaName);
    if (combo) {
        const [key, value] = combo;
        const ingredients = key.split('-');

        // Désélectionner tout d'abord toutes les options
        const selectedElements = document.querySelectorAll('.selected');
        selectedElements.forEach(element => element.classList.remove('selected'));

        // Sélectionner les ingrédients dans le tableau
        ingredients.forEach((ingredient, index) => {
            const category = Object.keys(window.selectedOptions)[index];
            const tdElements = document.querySelectorAll(`td[data-category="${category}"]`);
            tdElements.forEach(td => {
                if (td.textContent === ingredient) {
                    td.classList.add('selected');
                }
            });
        });

        // Afficher le nom de la pizza sélectionnée
        document.getElementById('pizzaName').innerText = pizzaName;
    }
}

// Initialisation de la matrice de sélection de pizza avec les données JSON
function initializePizzaMatrix(pizzaOptions) {
    const tableHeaders = document.getElementById('tableHeaders');
    const tableBody = document.getElementById('tableBody');
    const subTechniquesDiv = document.querySelector('.sub-techniques');

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

    // Fonction pour sélectionner une option
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
        window.selectedOptions[category] = value;
        
        // Afficher les sous-techniques si elles existent pour la catégorie sélectionnée
        subTechniquesDiv.innerHTML = ''; // Nettoyer les anciennes sous-techniques
        if (category === 'toppings' && value === 'Champignons') {
            // Afficher les sous-techniques pour Champignons
            const subTechniquesArray = pizzaOptions.subTechniques.Champignons;
            subTechniquesArray.forEach(sub => {
                const div = document.createElement('div');
                div.textContent = sub;
                // Ajouter un événement onclick pour sélectionner la sous-technique
                div.addEventListener('click', () => selectSubTechnique('Champignons', sub, div));
                subTechniquesDiv.appendChild(div);
            });
        } else {
            // Cacher les sous-techniques si aucune n'est sélectionnée ou si la catégorie ne nécessite pas de sous-techniques
            window.selectedOptions.subToppings = null; // Réinitialiser la sous-option si l'option principale change
        }
    }

    // Fonction pour sélectionner une sous-technique
    function selectSubTechnique(technique, subTechnique, element) {
        // Désélectionner la sélection précédente dans la même catégorie
        const prevSelected = document.querySelector(`.sub-selected[data-category="${technique}"]`);
        if (prevSelected) {
            prevSelected.classList.remove('sub-selected');
        }
        // Sélectionner la nouvelle sous-technique
        element.classList.add('sub-selected');
        window.selectedOptions.subToppings = subTechnique;
    }
}

// Objets pour stocker les options sélectionnées
window.selectedOptions = {
    pate: null,
    sauce: null,
    toppings: null,
    subToppings: null
};

// Fonction pour obtenir le nom de la pizza sélectionnée
function getPizzaName() {
    const { pate, sauce, toppings, subToppings } = window.selectedOptions;
    if (pate && sauce && toppings) {
        const combo = `${pate}-${sauce}-${toppings}`;
        if (subToppings && subToppings !== 'null') {
            combo += `-${subToppings}`;
        }
        const pizzaName = window.pizzaCombos[combo] || "Pizza inconnue";
        document.getElementById("pizzaName").innerText = pizzaName;
    } else {
        document.getElementById("pizzaName").innerText = "Veuillez sélectionner une option pour chaque catégorie.";
    }
}
