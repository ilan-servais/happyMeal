        /* Votre script JavaScript ici */
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
                        var recipeHtml = '<h3>' + recipe.nom + '</h3>'; // Affiche le nom de la recette
                        recipeHtml += '<p>Catégorie: ' + recipe.categorie + '</p>'; // Affiche la catégorie de la recette
                        recipeHtml += '<p>Temps de préparation: ' + recipe.temps_preparation + '</p>'; // Affiche le temps de préparation de la recette
                        recipeHtml += '<h4>Ingrédients:</h4>'; // Titre pour les ingrédients

                        // Boucle à travers les ingrédients et les ajoute à la liste
                        recipeHtml += '<ul>';
                        $.each(recipe.ingredients, function(i, ingredient) {
                            // Vérifier si la quantité est définie
                            if (ingredient.quantite !== undefined) {
                                recipeHtml += '<li>' + ingredient.nom + ' - ' + ingredient.quantite + '</li>';
                            } else {
                                recipeHtml += '<li>' + ingredient.nom + '</li>'; // Si la quantité est undefined, afficher juste le nom de l'ingrédient
                            }
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
                }
            });
        });

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
                page.push(items[i]); }

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
})(jQuery);
