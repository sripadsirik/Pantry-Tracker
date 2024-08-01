// src/utils/searchRecipe.js
import axios from 'axios';

const EDAMAM_APP_ID = "4bbc7bf2";
const EDAMAM_API_KEY = "e37ed5d80d54a280788ea3a57de4b6ff";

export const searchRecipe = async (ingredients) => {
  console.log("searchRecipe called with ingredients:", ingredients); // Logging

  const query = ingredients.join(',');
  const url = `https://api.edamam.com/search?q=${query}&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_API_KEY}`;

  try {
    const response = await axios.get(url);
    console.log("Edamam API response:", response.data); // Logging

    const recipes = response.data.hits.map(hit => hit.recipe.label).join(', ');
    return recipes;
  } catch (error) {
    console.error('Error searching for recipes:', error);
    return 'Error searching for recipes. Please try again.';
  }
};
