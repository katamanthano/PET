let selectedOptions = {
    pate: null,
    sauce: null,
    toppings: null,
    subToppings: null
};

// Charger les combos depuis le fichier JSON
let pizzaCombos = {};

fetch('pizza_options.json')
    .then(response => response.json())
    .then(data => {
        pizzaCombos = data.combos.reduce((acc, combo) => {
            const key = `${combo.pate}-${combo.sauce}-${combo.toppings}`;
            acc[key] = combo.name;
            if (combo.subToppings) {
                Object.keys(combo.subToppings).forEach(sub => {
                    acc[`${key}-${sub}`] = combo.subToppings[sub];
                });
            }
            return acc;
        }, {});
    })
    .catch(error => console.error('Erreur lors du chargement du fichier JSON', error));

function selectOption(category, value, element) {
    const prevSelected = document.querySelector(`td.selected[data-category="${category}"]`);
    if (prevSelected) {
        prevSelected.classList.remove('selected');
        prevSelected.removeAttribute('data-category');
    }
    element.classList.add('selected');
    element.setAttribute('data-category', category);
    selectedOptions[category] = value;
    selectedOptions.subToppings = null;
}

function selectSubOption(category, value, subValue, event) {
    event.stopPropagation();
    const subSelected = document.querySelector(`.sub-techniques .sub-selected`);
    if (subSelected) {
        subSelected.classList.remove('sub-selected');
    }
    event.target.classList.add('sub-selected');
    selectedOptions[category] = value;
    selectedOptions.subToppings = subValue === 'null' ? null : subValue;
}

function toggleSubTechniques(event, subTechId) {
    event.stopPropagation();
    const subTechniques = document.getElementById(subTechId);
    subTechniques.style.display = subTechniques.style.display === "none" || !subTechniques.style.display ? "block" : "none";
}

function getPizzaName() {
    const { pate, sauce, toppings, subToppings } = selectedOptions;
    let combo = `${pate}-${sauce}-${toppings}`;
    if (subToppings) {
        combo += `-${subToppings}`;
    }

    if (pate && sauce && toppings) {
        const pizzaName = pizzaCombos[combo] || "Pizza inconnue";
        document.getElementById("pizzaName").innerText = pizzaName;
    } else {
        document.getElementById("pizzaName").innerText = "Veuillez sélectionner une option pour chaque catégorie.";
    }
}
