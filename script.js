// Fonction pour initialiser la matrice de sélection de pizza avec les données JSON
function initializePizzaMatrix(pizzaOptions) {
    const tableHeaders = document.getElementById('tableHeaders');
    const tableBody = document.getElementById('tableBody');

    // Ajouter les en-têtes de colonnes (Pâte, Sauce, Toppings)
    Object.keys(pizzaOptions).forEach(option => {
        const th = document.createElement('th');
        th.textContent = option.charAt(0).toUpperCase() + option.slice(1);
        tableHeaders.appendChild(th);
    });

    // Générer les lignes pour les options disponibles
    Object.keys(pizzaOptions).forEach(category => {
        const options = pizzaOptions[category];
        options.forEach(option => {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.textContent = option;
            td.setAttribute('data-category', category);
            td.addEventListener('click', () => toggleSubTechniques(option, td));
            tr.appendChild(td);
            tableBody.appendChild(tr);

            // Ajouter des sous-techniques directement sous chaque technique, si elles existent
            if (pizzaOptions.subTechniques[option]) {
                pizzaOptions.subTechniques[option].forEach(sub => {
                    const subTr = document.createElement('tr');
                    const subTd = document.createElement('td');
                    subTd.textContent = sub;
                    subTd.classList.add('sub-technique');
                    subTd.style.display = 'none'; // Masquer initialement
                    subTr.appendChild(subTd);
                    tableBody.appendChild(subTr);
                });
            }
        });
    });
}

// Fonction pour afficher/masquer les sous-techniques
function toggleSubTechniques(option, td) {
    const subTechniques = document.querySelectorAll('.sub-technique');
    subTechniques.forEach(sub => {
        if (sub.previousElementSibling === td) {
            sub.style.display = sub.style.display === 'none' ? '' : 'none';
        }
    });
}
