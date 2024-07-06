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

    pizzaCombos.forEach(combo => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td onclick="selectOption('pate', '${combo.pate}', this)">${combo.pate}</td>
            <td onclick="selectOption('sauce', '${combo.sauce}', this)">${combo.sauce}</td>
            <td onclick="selectOption('toppings', '${combo.toppings}', this)">${combo.toppings}</td>
        `;
        tbody.appendChild(row);

        // Ajouter les sous-options si elles existent
        if (combo.subToppings) {
            const subRow = document.createElement('tr');
            subRow.style.display = 'none'; // Les sous-options sont cachées par défaut
            subRow.innerHTML = `
                <td colspan="3">
                    <div class="sub-techniques">
                        ${Object.keys(combo.subToppings).map(sub => `
                            <div onclick="selectSubOption('toppings', '${combo.toppings}', '${sub}', event)">${sub}</div>
                        `).join('')}
                    </div>
                </td>
            `;
            tbody.appendChild(subRow);
        }
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
