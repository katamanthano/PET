let selectedOptions = {
    pate: null,
    sauce: null,
    toppings: null,
    subToppings: null
};

// Fonction pour charger et traiter les données JSON
function loadPizzaData() {
    fetch('pizza_data.json')
        .then(response => response.json())
        .then(data => {
            // Appeler des fonctions pour générer les en-têtes et options dans le tableau
            generateTableHeaders(data);
            generatePizzaOptions(data);
        })
        .catch(error => console.error('Erreur lors du chargement du fichier JSON', error));
}

// Fonction pour générer les en-têtes du tableau à partir des données JSON
function generateTableHeaders(data) {
    const thead = document.getElementById('pizzaOptionsHeader');
    const headerRow = document.createElement('tr');

    // Générer les en-têtes pour Pâte, Sauce et Toppings
    data.tactiques.forEach(tactique => {
        tactique.techniques.forEach(technique => {
            Object.keys(technique).forEach(key => {
                const th = document.createElement('th');
                th.innerText = key.charAt(0).toUpperCase() + key.slice(1); // Mettre la première lettre en majuscule
                headerRow.appendChild(th);
            });
        });
    });

    thead.appendChild(headerRow);
}

// Fonction pour générer les options de pizza à partir des données JSON
function generatePizzaOptions(data) {
    const tbody = document.getElementById('pizzaOptionsBody');
    tbody.innerHTML = ''; // Nettoyer le contenu existant

    data.tactiques.forEach(tactique => {
        tactique.techniques.forEach(technique => {
            const row = document.createElement('tr');

            // Générer les options pour Pâte, Sauce et Toppings
            Object.values(technique).forEach(value => {
                const optionCell = document.createElement('td');
                optionCell.innerText = value;
                optionCell.setAttribute('onclick', `selectOption('${Object.keys(technique)[0]}', '${value}', this)`);
                row.appendChild(optionCell);
            });

            tbody.appendChild(row);
        });
    });
}

// Fonction pour sélectionner une option
function selectOption(category, value, element) {
    // Désélectionner la sélection précédente dans la même catégorie
    const prevSelected = document.querySelector(`td.selected[data-category="${category}"]`);
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

// Fonction pour obtenir le nom de la pizza en fonction des options sélectionnées
function getPizzaName() {
    const { pate, sauce, toppings, subToppings } = selectedOptions;
    let combo = `${pate}-${sauce}-${toppings}`;
    if (subToppings) {
        combo += `-${subToppings}`;
    }

    if (pate && sauce && toppings) {
        // Remplacez ceci par la logique pour obtenir le nom de la pizza à partir du fichier JSON
        const pizzaName = "Pizza correspondante"; // Logique à mettre à jour
        document.getElementById("pizzaName").innerText = pizzaName;
    } else {
        document.getElementById("pizzaName").innerText = "Veuillez sélectionner une option pour chaque catégorie.";
    }
}

// Charger les données JSON au chargement de la page
document.addEventListener('DOMContentLoaded', loadPizzaData);
