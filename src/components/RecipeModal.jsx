import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const RecipeModal = ({ recipe, open, onClose }) => {
  if (!recipe) return null;

  const ingredients = Object.keys(recipe)
    .filter(key => key.startsWith('strIngredient') && recipe[key])
    .map(key => ({
      ingredient: recipe[key],
      measure: recipe[`strMeasure${key.slice(13)}`]
    }));

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="p-6 bg-white rounded-lg mx-auto my-4 max-w-3xl md:max-w-4xl overflow-y-auto max-h-[calc(100vh-24px)] relative">
        <div className="p-2 bg-gray-100 rounded-t-lg flex justify-between items-center">
          <Typography variant="h6">Recipe Details</Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </div>
        <Typography variant="h4" gutterBottom>{recipe.strMeal}</Typography>
        <Typography variant="subtitle1" gutterBottom><strong>Category:</strong> {recipe.strCategory}</Typography>
        <Typography variant="subtitle1" gutterBottom><strong>Area:</strong> {recipe.strArea}</Typography>
        <img src={recipe.strMealThumb} alt={recipe.strMeal} className="w-full h-80 object-cover rounded-lg mb-4" />
        <Typography variant="h6" className="font-bold mt-4">Ingredients:</Typography>

        {/* List ingredients with quantities */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
          {ingredients.map((item, index) => (
            <div key={index}>
              {item.measure ? <span className="font-medium">{item.measure} </span> : ''}{item.ingredient}
            </div>
          ))}
        </div>
        <Typography variant="h6" className="font-bold mt-4">Instructions:</Typography>
        <Typography className="mb-4">{recipe.strInstructions}</Typography>

        {/* Youtube Video */}
        {recipe.strYoutube && recipe.strYoutube.includes('v=') && (
          <div className="mt-4">
            <Typography variant="h6">Video:</Typography>
            <iframe width="100%" height="415" src={`https://www.youtube.com/embed/${recipe.strYoutube.split('v=')[1]}`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
        )}
      </Box>
    </Modal>
  );
};

export default RecipeModal;
