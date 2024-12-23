import React from 'react';

const RecipeCard = ({ recipe, onClick }) => {
  return (
    <div key={recipe.idMeal} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg" onClick={() => onClick(recipe)}>
        <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="w-full h-60 object-cover"
        />
        <div className="p-4">
            <h3 className="font-semibold text-lg">{recipe.strMeal}</h3>
        </div>
    </div>
  );
};

export default RecipeCard;