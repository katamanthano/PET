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
    Object.keys(pizzaOptions).forEach(category => {
        const options = pizzaOptions[category];
        options.forEach(option => {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.textContent = option;
            td.setAttribute('data-category', category);
            td.addEventListener('click', () => selectOption(category, option, td));
            tr.appendChild(td);
            tableBody.appendChild(tr);

            // Si l'option a des sous-techniques, les préparer mais ne pas les afficher immédiatement
            if (pizzaOptions.subTechniques && pizzaOptions.subTechniques[option]) {
                pizzaOptions.subTechniques[option].forEach(sub => {
                    const subTr = document.createElement('tr');
                    const subTd = document.createElement('td');
                    subTd.textContent = sub;
                    subTd.style.display = 'none'; // Masquer initialement
                    subTd.classList.add('sub-technique');
                    subTr.appendChild(subTd);
                    tableBody.appendChild(subTr);
                });
            }
        });
    });
}

// Fonction pour sélectionner une option et gérer l'affichage des sous-techniques
function selectOption(category, option, element) {
    // Logique pour gérer la sélection/désélection
    // Trouver et gérer les sous-techniques
    const subTechniques = document.querySelectorAll('.sub-technique');
    subTechniques.forEach(sub => {
        if (sub.textContent === option) {
            sub.style.display = sub.style.display === 'none' ? '' : 'none';
        }
    });
}
