jQuery.noConflict();

$(document).ready(function() {
    $.getJSON("data.json", function(data) {
        var allRecipes = data.recettes;

        // Affichage initial des recettes
        showRecipes(allRecipes);

        // Pagination des recettes
        $('.article-loop').paginate(3); // Changer 3 par le nombre de recettes par page souhaité

        // Fonction pour afficher les recettes
        function showRecipes(recipes) {
            var recipeList = $('#recipeList');
            recipeList.empty(); // Vide la liste des recettes avant de les ajouter
    
            $.each(recipes, function(index, recipe) {
                var recipeHtml = '<h3>' + recipe.nom + '</h3>' + '<button class="btn primary-btn add-recipe-btn">Ajouter aux favoris</button>'; // Affiche le nom de la recette
                recipeHtml += '<p>Catégorie: ' + recipe.categorie + '</p>'; // Affiche la catégorie de la recette
                recipeHtml += '<p>Temps de préparation: ' + recipe.temps_preparation + '</p>'; // Affiche le temps de préparation de la recette
                recipeHtml += '<h4>Ingrédients:</h4>'; // Titre pour les ingrédients
    
                // Boucle à travers les ingrédients et les ajoute à la liste
                recipeHtml += '<ul>';
                $.each(recipe.ingredients, function(i, ingredient) {
                    // Ajoute un bouton à côté de chaque ingrédient
                    recipeHtml += '<li>' + ingredient.nom + ' <button class=" add-ingredient-btn">+</button></li>';
                });                        
    
                recipeHtml += '<h4>Étapes de préparation:</h4>'; // Titre pour les étapes de préparation
    
                // Boucle à travers les étapes de préparation et les ajoute à la liste
                recipeHtml += '<ol>';
                $.each(recipe.etapes, function(i, etape) {
                    recipeHtml += '<li>' + etape + '</li>';
                });
                recipeHtml += '</ol>';
    
                // Ajoute la recette au conteneur de liste de recettes
                recipeList.append('<div class="article-loop">' + recipeHtml + '</div>');
            });

            


            // Gestionnaire de clic pour ajouter une recette aux favoris
            $('#recipeList').on('click', '.add-recipe-btn', function() {
                // Récupérer le nom de la recette à partir du titre de la recette
                var recipeName = $(this).closest('.article-loop').find('h3').text().trim();

                // Vérifier si la recette n'est pas déjà dans les favoris
                if ($('#favoritesList').find('li:contains("' + recipeName + '")').length === 0) {
                    // Ajouter la recette à la liste des favoris
                    $('#favoritesList').append('<li>' + recipeName + ' <button class="remove-favorite-btn">Supprimer</button></li>');
                } else {
                    // Afficher un message indiquant que la recette est déjà dans les favoris
                    alert('La recette "' + recipeName + '" est déjà dans les favoris.');
                }

                $('#favoritesModal').modal('show');
            });

            
            // Gestionnaire de clic pour supprimer une recette des favoris
            $('#favoritesList').on('click', '.remove-favorite-btn', function() {
                $(this).parent().remove(); // Supprimer l'élément parent (l'élément <li> contenant la recette)
            });

            // Gestionnaire de clic pour ouvrir la modal des favoris
            $('#openFavoritesModalBtn').on('click', function() {
                $('#favoritesModal').modal('show');
            });


    
            // Gestionnaire de clic pour supprimer un ingrédient de la modal
            $('#ingredientModal').on('click', '.remove-ingredient-btn', function() {
                $(this).parent().remove(); // Supprimer l'élément parent (l'élément <li> contenant l'ingrédient)
            });

            $('.modal-footer').on('click', '.delete-btn', function() {
                $('#ingredientModal .modal-body').empty(); // Remove all child nodes of the modal-body
            });

            $('.pdfButton').on('click', function() {
                generatePDF();
            });

            
// Ajout d'un gestionnaire de clic pour les boutons d'ajout d'ingrédient
            $('#recipeList').on('click', '.add-ingredient-btn', function() {
                let ingredientName = $(this).parent().text().replace($(this).text(), '').trim();
                // Vérifier si l'ingrédient n'est pas déjà présent dans la modal
                if ($('#ingredientModal').find('li:contains("' + ingredientName + '")').length === 0) {
                    // Open the modal
                    $('#ingredientModal').modal('show');
                    // Ajouter l'ingrédient à la modal
                    $('#ingredientModal .modal-body').append('<li>' + ingredientName + '<button class="btn btn-secondary remove-ingredient-btn">Supprimer</button></li>');
                } else {
                    // Afficher un message d'alerte ou une notification pour informer l'utilisateur
                    alert('Vous avez déjà ajouté cet ingrédient à la liste.');
                }
            });
            
            $('#openModalBtn').on('click', function() {
                $('#ingredientModal').modal('show'); // Afficher la modal
            });

            // Gestionnaire de clic pour ajouter une recette aux favoris
            $('#recipeList').on('click', '.add-to-favorites-btn', function() {
                // Récupérer le nom de la recette à partir du titre de la recette
                var recipeName = $(this).closest('.article-loop').find('h3').text().trim();

                // Vérifier si la recette n'est pas déjà dans les favoris
                if ($('#favoritesList').find('li:contains("' + recipeName + '")').length === 0) {
                    // Ajouter la recette à la liste des favoris
                    $('#favoritesList').append('<li>' + recipeName + ' <button class="remove-favorite-btn">Supprimer</button></li>');
                } else {
                    // Afficher un message indiquant que la recette est déjà dans les favoris
                    alert('La recette "' + recipeName + '" est déjà dans les favoris.');
                }
            });

            // Gestionnaire de clic pour supprimer une recette des favoris
            $('#favoritesList').on('click', '.remove-favorite-btn', function() {
                $(this).parent().remove(); // Supprimer l'élément parent (l'élément <li> contenant la recette)
            });

            // Gestionnaire de clic pour ouvrir la modal des favoris
            $('#openFavoritesModalBtn').on('click', function() {
                $('#favoritesModal').modal('show');
            });


        }
    });
});

function generatePDF() {
    print()
}

// Code pour la pagination des recettes
(function($) {
    var paginate = {
        startPos: function(pageNumber, perPage) {
            // determine what array position to start from
            // based on current page and # per page
            return pageNumber * perPage;
        },

        getPage: function(items, startPos, perPage) {
            // declare an empty array to hold our page items
            var page = [];

            // only get items after the starting position
            items = items.slice(startPos, items.length);

            // loop remaining items until max per page
            for (var i=0; i < perPage; i++) {
                page.push(items[i]);
            }

            return page;
        },

        totalPages: function(items, perPage) {
            // determine total number of pages
            return Math.ceil(items.length / perPage);
        },

        createBtns: function(totalPages, currentPage) {
            // create buttons to manipulate current page
            var pagination = $('<div class="pagination" />');

            // add a "first" button
            pagination.append('<span class="pagination-button">&laquo;</span>');

            // add pages inbetween
            for (var i=1; i <= totalPages; i++) {
                // truncate list when too large
                if (totalPages > 5 && currentPage !== i) {
                    // if on first two pages
                    if (currentPage === 1 || currentPage === 2) {
                        // show first 5 pages
                        if (i > 5) continue;
                        // if on last two pages
                    } else if (currentPage === totalPages || currentPage === totalPages - 1) {
                        // show last 5 pages
                        if (i < totalPages - 4) continue;
                        // otherwise show 5 pages w/ current in middle
                    } else {
                        if (i < currentPage - 2 || i > currentPage + 2) {
                            continue; }
                    }
                }

                // markup for page button
                var pageBtn = $('<span class="pagination-button page-num" />');

                // add active class for current page
                if (i == currentPage) {
                    pageBtn.addClass('active'); }

                // set text to the page number
                pageBtn.text(i);

                // add button to the container
                pagination.append(pageBtn);
            }

            // add a "last" button
            pagination.append($('<span class="pagination-button">&raquo;</span>'));

            return pagination;
        },

        createPage: function(items, currentPage, perPage) {
            // remove pagination from the page
            $('.pagination').remove();

            // set context for the items
            var container = items.parent(),
                // detach items from the page and cast as array
                items = items.detach().toArray(),
                // get start position and select items for page
                startPos = this.startPos(currentPage - 1, perPage),
                page = this.getPage(items, startPos, perPage);

            // loop items and readd to page
            $.each(page, function(){
                // prevent empty items that return as Window
                if (this.window === undefined) {
                    container.append($(this)); }
            });

            // prep pagination buttons and add to page
            var totalPages = this.totalPages(items, perPage),
                pageButtons = this.createBtns(totalPages, currentPage);

            container.after(pageButtons);
        }
    };

    // stuff it all into a jQuery method!
    $.fn.paginate = function(perPage) {
        var items = $(this);

        // default perPage to 5
        if (isNaN(perPage) || perPage === undefined) {
            perPage = 5; }

        // don't fire if fewer items than perPage
        if (items.length <= perPage) {
            return true; }

        // ensure items stay in the same DOM position
        if (items.length !== items.parent()[0].children.length) {
            items.wrapAll('<div class="pagination-items" />');
        }

        // paginate the items starting at page 1
        paginate.createPage(items, 1, perPage);

        // handle click events on the buttons
        $(document).on('click', '.pagination-button', function(e) {
            // get current page from active button
            var currentPage = parseInt($('.pagination-button.active').text(), 10),
                newPage = currentPage,
                totalPages = paginate.totalPages(items, perPage),
                target = $(e.target);

            // get numbered page
            newPage = parseInt(target.text(), 10);
            if (target.text() == '«') newPage = 1;
            if (target.text() == '»') newPage = totalPages;

            // ensure newPage is in available range
            if (newPage > 0 && newPage <= totalPages) {
                paginate.createPage(items, newPage, perPage); }
        });
    };

    $('.article-loop').paginate(2);        
});
