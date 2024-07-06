let selectedOptions = {
    pate: null,
    sauce: null,
    toppings: null,
    subToppings: null
};

let pizzaCombos = {}; // Contiendra les combos chargés depuis le fichier JSON

fetch('pizza_options.json')
    .then(response => response.json())
    .then(data => {
        pizzaCombos = data.combos;
        generateMatrix(); // Appel pour générer la matrice basée sur les données JSON
    })
    .catch(error => console.error('Erreur lors du chargement du fichier JSON', error));

function generateMatrix() {
    const tbody = document.getElementById('matrixBody');
    tbody.innerHTML = ''; // Nettoyer le contenu existant

    // Utiliser un objet pour stocker les options uniques de pâte, sauce et toppings
    const uniqueOptions = {
        pate: new Set(),
        sauce: new Set(),
        toppings: new Set()
    };

    // Remplir l'objet des options uniques à partir des données JSON
    pizzaCombos.forEach(combo => {
        uniqueOptions.pate.add(combo.pate);
        uniqueOptions.sauce.add(combo.sauce);
        uniqueOptions.toppings.add(combo.toppings);
    });

    // Convertir les Sets en tableaux pour pouvoir les parcourir
    const pates = Array.from(uniqueOptions.pate);
    const sauces = Array.from(uniqueOptions.sauce);
    const toppings = Array.from(uniqueOptions.toppings);

    // Générer les lignes de la matrice avec les options récupérées
    pates.forEach(pate => {
        sauces.forEach(sauce => {
            toppings.forEach(topping => {
                // Filtrer les combos qui correspondent aux options actuelles
                const matchingCombos = pizzaCombos.filter(combo => combo.pate === pate && combo.sauce === sauce && combo.toppings === topping);

                // Si au moins un combo correspondant est trouvé, créer la cellule de la matrice
                if (matchingCombos.length > 0) {
                    const row = document.createElement('tr');

                    // Pâte
                    const pateCell = document.createElement('td');
                    pateCell.innerText = pate;
                    pateCell.setAttribute('onclick', `selectOption('pate', '${pate}', this)`);
                    row.appendChild(pateCell);

                    // Sauce
                    const sauceCell = document.createElement('td');
                    sauceCell.innerText = sauce;
                    sauceCell.setAttribute('onclick', `selectOption('sauce', '${sauce}', this)`);
                    row.appendChild(sauceCell);

                    // Toppings
                    const toppingsCell = document.createElement('td');
                    toppingsCell.innerText = topping;

                    // Vérifier si ce combo a des sous-options
                    if (matchingCombos.some(combo => combo.subToppings)) {
                        const toggleButton = document.createElement('button');
                        toggleButton.classList.add('btn', 'btn-sm', 'btn-light');
                        toggleButton.innerText = '+';
                        toggleButton.setAttribute('onclick', `toggleSubTechniques(event, '${pate}-${sauce}-${topping}')`);

                        const span = document.createElement('span');
                        span.innerText = `${topping} `;
                        span.appendChild(toggleButton);
                        toppingsCell.appendChild(span);

                        const subTechniquesDiv = document.createElement('div');
                        subTechniquesDiv.classList.add('sub-techniques');
                        subTechniquesDiv.setAttribute('id', `${pate}-${sauce}-${topping}`);
                        subTechniquesDiv.style.display = 'none'; // Cacher par défaut

                        // Ajouter les sous-options pour ce combo
                        matchingCombos.forEach(combo => {
                            if (combo.subToppings) {
                                Object.keys(combo.subToppings).forEach(sub => {
                                    const subOptionDiv = document.createElement('div');
                                    subOptionDiv.innerText = sub;
                                    subOptionDiv.setAttribute('onclick', `selectSubOption('toppings', '${topping}', '${sub}', event)`);
                                    subTechniquesDiv.appendChild(subOptionDiv);
                                });
                            }
                        });

                        toppingsCell.appendChild(subTechniquesDiv);
                    } else {
                        toppingsCell.setAttribute('onclick', `selectOption('toppings', '${topping}', this)`);
                    }

                    row.appendChild(toppingsCell);
                    tbody.appendChild(row);
                }
            });
        });
    });
}

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

    // Cacher toutes les sous-options lorsqu'une option principale est sélectionnée
    document.querySelectorAll('.sub-techniques').forEach(div => {
        div.style.display = 'none';
    });
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
        const pizzaName = pizzaCombos.find(item => {
            if (item.subToppings) {
                return item.pate === pate && item.sauce === sauce && item.toppings === toppings && item.subToppings[subToppings];
            } else {
                return item.pate === pate && item.sauce === sauce && item.toppings === toppings;
            }
        });

        document.getElementById("pizzaName").innerText = pizzaName ? pizzaName.name : "Pizza inconnue";
    } else {
        document.getElementById("pizzaName").innerText = "Veuillez sélectionner une option pour chaque catégorie.";
    }
}
