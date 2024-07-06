document.addEventListener('DOMContentLoaded', function () {
    fetch('pizza-data.json')
        .then(response => response.json())
        .then(data => initializePizzaTable(data))
        .catch(error => console.error('Error loading the pizza data:', error));
});

function initializePizzaTable(data) {
    const tableBody = document.getElementById('tableBody');
    const { pate, sauce, toppings } = data.pizzaOptions;

    // Assumons qu'il y a le même nombre d'éléments pour chaque catégorie pour simplifier
    for (let i = 0; i < pate.length; i++) {
        const tr = document.createElement('tr');
        
        // Créer des colonnes pour chaque catégorie
        createTd(pate[i], 'pate', tr);
        createTd(sauce[i % sauce.length], 'sauce', tr); // Gérer le cas où il y a moins de sauces que de pâtes
        createTd(toppings[i % toppings.length], 'toppings', tr, data.subTechniques); // Gérer les sous-techniques
        
        tableBody.appendChild(tr);
    }
}

function createTd(text, category, tr, subTechniques) {
    const td = document.createElement('td');
    td.textContent = text;
    td.setAttribute('data-category', category);
    td.onclick = function() { toggleSubTechniques(text, category, subTechniques); };
    tr.appendChild(td);
    
    // Gestion des sous-techniques directement sous les options de toppings
    if (category === 'toppings' && subTechniques && subTechniques[text]) {
        const subTr = document.createElement('tr');
        subTr.style.display = 'none'; // Commencer caché
        const subTd = document.createElement('td');
        subTd.colSpan = 3;
        subTd.textContent = subTechniques[text].join(", ");
        subTr.appendChild(subTd);
        tr.after(subTr); // Placer directement après la ligne de la technique principale
        td.onclick = function() {
            subTr.style.display = subTr.style.display === 'none' ? '' : 'none';
        };
    }
}

function toggleSubTechniques(selectedOption, category, subTechniques) {
    // Cette fonction peut être adaptée si nécessaire pour une gestion plus complexe
}
