$(function() {
  // Afficher les détails de la recette sélectionnée
  function showrecipeDetails2(recipe) {
    var details = $("#recipeDetails2");
    details.empty(); // Vider les détails précédents

    // Créer les éléments HTML pour afficher les détails de la recette
    var recipeTitle = $("<h2>").text(recipe.nom);
    var ingredientsList = $("<ul>");
    recipe.ingredients.forEach(function(ingredient) {
      ingredientsList.append($("<li>").text(ingredient.nom + " - " + ingredient.quantite));
    });
    var preparationTime = $("<p>").text("Temps de préparation : " + recipe.temps_preparation);
    var stepsList = $("<ol>");
    recipe.etapes.forEach(function(step) {
      stepsList.append($("<li>").text(step));
    });

    // Ajouter les éléments au conteneur de détails
    details.append(recipeTitle, ingredientsList, preparationTime, stepsList);

    // Ajouter le bouton "Ajouter au favoris"
    var addToFavoritesBtn = $("<button>").text("Ajoutez au favoris").click(function() {
      addToFavorites(recipe);
    });
    details.append(addToFavoritesBtn);
  }

  // Ajouter une recette aux favoris
  function addToFavorites(recipe) {
    // À implémenter selon les besoins
    // Ajouter la recette à une liste de favoris et mettre en place une indication visuelle appropriée
    console.log("Recette ajoutée aux favoris :", recipe.nom);
  }

  // Activer l'autocomplétion de la barre de recherche
  $("#searchInput").autocomplete({
    source: function(request, response) {
      $.getJSON("data.json", function(data) {
        var term = request.term.toLowerCase();
        var suggestions = data.recettes.filter(function(recipe) {
          return recipe.nom.toLowerCase().indexOf(term) !== -1;
        }).map(function(recipe) {
          return recipe.nom;
        });

        response(suggestions);
      });
    },
    minLength: 2, // Nombre minimum de caractères pour déclencher l'autocomplétion
    select: function(event, ui) {
      var selectedRecipe = ui.item.value;
      $.getJSON("data.json", function(data) {
        var selectedrecipeDetails2;

        // Trouver les détails de la recette sélectionnée
        for (var i = 0; i < data.recettes.length; i++) {
          if (data.recettes[i].nom === selectedRecipe) {
            selectedrecipeDetails2 = data.recettes[i];
            break;
          }
        }

        // Afficher les détails de la recette sélectionnée
        showrecipeDetails2(selectedrecipeDetails2);
      });
    }
  });
});
