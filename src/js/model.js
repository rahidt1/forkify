import { async } from 'regenerator-runtime';
import { API_URL } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
  },
};

export const loadRecipe = async function (id) {
  try {
    // Here an async function (loadRecipe) calling an async function (getJSON)
    // As async function return a promise, here we are handling the promise using await
    const data = await getJSON(`${API_URL}${id}`);

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
    // Catch error from 'helpers.js'
    // Re-throwing error, because we want to handle the error in 'controller.js', not here
    throw err;
    // console.error(err);
  }
};

export const loadSearchResults = async function (query) {
  try {
    
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        image: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
      };
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
