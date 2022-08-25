import { async } from 'regenerator-runtime';
import { API_URL, RESULTS_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    page: 1, // By default page is 1
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

export const getSearchResultsPage = function (page = state.search.page) {
  // Storing the page number in state
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // (page=1-1)*10=0
  const end = page * state.search.resultsPerPage; // page*10=10

  return state.search.results.slice(start, end); // 0-9 Slice method dont include last number
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    // newQuantity = (oldQuantity * newServings) / oldServings
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};
