import { async } from 'regenerator-runtime';
import { API_URL } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
};

export const loadRecipe = async function (id) {
  try {
    // Here an async function (loadRecipe) calling an async function (getJSON)
    // As async function return a promise, here we are handling the promise using await
    const data = await getJSON(`${API_URL}/${id}`);

    const { recipe } = data.data;
    state.recipe = {
      cookingTime: recipe.cooking_time,
      id: recipe.id,
      image: recipe.image_url,
      ingredients: recipe.ingredients,
      publisher: recipe.publisher,
      servings: recipe.servings,
      sourceUrl: recipe.source_url,
      title: recipe.title,
    };
    // console.log(state.recipe);
  } catch (err) {
    console.error(err);
  }
};
