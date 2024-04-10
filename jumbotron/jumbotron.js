// Fonction pour charger les recettes aléatoires depuis le fichier JSON
async function loadRandomRecipeFromJSON() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        const recipes = data.recettes;
        const randomIndex = Math.floor(Math.random() * recipes.length);
        const randomRecipe = recipes[randomIndex];

        // Générez le HTML pour afficher les détails de la recette
        const recipeDetailsHTML = `
            <h2>${randomRecipe.nom}</h2>
            <p><strong>Ingrédients:</strong></p>
            <ul>
                ${randomRecipe.ingredients.map(ingredient => `<li>${ingredient.nom} - ${ingredient.quantite}</li>`).join('')}
            </ul>
            <p><strong>Temps de préparation:</strong> ${randomRecipe.temps_preparation}</p>
            <p><strong>Étapes:</strong></p>
            <ol>
                ${randomRecipe.etapes.map(step => `<li>${step}</li>`).join('')}
            </ol>
        `;

        // Affichez les détails de la recette dans le jumbotron
        document.getElementById('recipeDetails').innerHTML = recipeDetailsHTML;
    } catch (error) {
        console.error('Erreur lors du chargement des recettes :', error);
    }
}

// Fonction pour générer un fichier PDF à partir des détails de la recette
function generatePDF() {
    const doc = new jsPDF(); // Créez un nouvel objet jsPDF

    // Récupérez les détails de la recette depuis le DOM
    const recipeTitle = document.querySelector('#recipeDetails h2').textContent;
    const ingredientsList = document.querySelectorAll('#recipeDetails ul li');
    const stepsList = document.querySelectorAll('#recipeDetails ol li');

    // Générez le contenu du PDF en format texte
    let pdfContent = `Recette : ${recipeTitle}\n\nIngrédients:\n`;
    ingredientsList.forEach(ingredient => {
        pdfContent += `- ${ingredient.textContent}\n`;
    });
    pdfContent += `\nÉtapes:\n`;
    stepsList.forEach((step, index) => {
        pdfContent += `${index + 1}. ${step.textContent}\n`;
    });

    // Ajoutez le contenu au document PDF
    doc.text(pdfContent, 10, 10);

    // Téléchargez le fichier PDF
    doc.save('recette.pdf');
}

// Écoutez le clic sur le bouton "Générer PDF"
document.getElementById('generatePDFBtn').addEventListener('click', generatePDF);

// Chargez une recette aléatoire au chargement de la page
window.onload = loadRandomRecipeFromJSON;

