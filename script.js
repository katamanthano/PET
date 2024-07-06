document.addEventListener('DOMContentLoaded', function () {
    fetch('pizza-data.json')
        .then(response => response.json())
        .then(data => initializePizzaTable(data))
        .catch(error => console.error('Error loading the pizza data:', error));
});

function initializePizzaTable(data) {
    const tableBody = document.getElementById('tableBody');

    // Génération des lignes pour les options de base
    data.pizzaOptions.forEach(option => {
        const tr = document.createElement('tr');
        Object.keys(option).forEach(key => {
            const td = document.createElement('td');
            td.textContent = option[key];
            td.setAttribute('data-category', key);
            td.onclick = () => toggleSubTechniques(option[key], key);
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);

        // Générer les sous-techniques si disponibles
        if (data.subTechniques && data.subTechniques[option.toppings]) {
            data.subTechniques[option.toppings].forEach(sub => {
                const subTr = document.createElement('tr');
                subTr.classList.add('sub-technique');
                const subTd = document.createElement('td');
                subTd.colSpan = 3;
                subTd.textContent = sub;
                subTr.appendChild(subTd);
                tableBody.appendChild(subTr);
            });
        }
    });
}

function toggleSubTechniques(selectedOption, category) {
    if (category === 'toppings') { // Seulement pour les toppings par exemple
        const rows = Array.from(document.querySelectorAll('.sub-technique'));
        rows.forEach(row => {
            if (row.previousElementSibling.querySelector('td[data-category="toppings"]').textContent === selectedOption) {
                row.style.display = row.style.display === 'none' ? 'table-row' : 'none';
            }
        });
    }
}
