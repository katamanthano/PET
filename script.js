document.addEventListener('DOMContentLoaded', function () {
    fetch('pizza_options.json')
        .then(response => response.json())
        .then(data => {
            console.log(data); // Vérifiez les données dans la console

            // Générer dynamiquement les options de pizza
            const pizzaOptionsDiv = document.getElementById('pizzaOptions');

            data.categories.forEach(category => {
                const categoryDiv = document.createElement('div');
                categoryDiv.classList.add('category');

                const categoryName = document.createElement('h2');
                categoryName.textContent = category.name;
                categoryDiv.appendChild(categoryName);

                const optionsList = document.createElement('ul');
                category.options.forEach(option => {
                    const optionItem = document.createElement('li');
                    optionItem.textContent = option.name;
                    optionsList.appendChild(optionItem);
                });

                categoryDiv.appendChild(optionsList);
                pizzaOptionsDiv.appendChild(categoryDiv);
            });
        })
        .catch(error => console.error('Erreur lors du chargement des données :', error));
});
