import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// Forkify API
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// Hot module reloading
if (module.hot) {
  module.hot.accept();
}

// Individual recipe
const controlRecipes = async function () {
  try {
    // Get id from hash
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 1) Load recipe from api
    await model.loadRecipe(id);

    // 2) Render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    // Catch error from 'model.js'
    // Render error in 'recipeiew.js'
    recipeView.renderError();
  }
};

// Search results
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Load search results
    await model.loadSearchResults(query);

    // 3. Render results
    // console.log(model.state.search.results);
    resultsView.render(model.state.search.results);
  } catch (err) {
    console.log(err);
  }
};

// Publish-subscriber design pattern
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHanderSearch(controlSearchResults);
};
init();

// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);

// Moved to recipeView following MVC architecture
/*
['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, controlRecipes)
);
*/
