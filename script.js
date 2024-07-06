// Charger les options de pizza et les combos à partir du fichier JSON
fetch('pizza-data.json')
    .then(response => response.json())
    .then(data => {
        initializePizzaMatrix(data.pizzaOptions); // Initialiser la matrice de sélection de pizza avec les options
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
        Object.values(pizzaOptions).forEach(options => {
            const td = document.createElement('td');
            if (Array.isArray(options) && options[i]) {
                td.textContent = options[i];
                td.setAttribute('onclick', `selectOption('${Object.keys(pizzaOptions)[Object.values(pizzaOptions).indexOf(options)]}', '${options[i]}', this)`);
            }
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    }
}

// Objets pour stocker les options sélectionnées
let selectedOptions = {
    pate: null,
    sauce: null,
    toppings: null,
    subToppings: null
};

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
    selectedOptions[category] = value;
    selectedOptions.subToppings = null; // Réinitialiser la sous-option si l'option principale change
}

// Fonction pour obtenir le nom de la pizza sélectionnée
function getPizzaName() {
    const { pate, sauce, toppings, subToppings } = selectedOptions;
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
