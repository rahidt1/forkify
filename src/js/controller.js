import { MODAL_CLOSE_SEC } from './config.js';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// Forkify API
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// Hot module reloading
// if (module.hot) {
//   module.hot.accept();
// }

//***********************************************//
// Individual recipe
const controlRecipes = async function () {
  try {
    // Get id from hash
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 1. Update search results
    // As new recipe loads (beacuse of hash change), we update the resultsView page, to add the 'preview__link--active' class to the current recipe from the recipe list
    resultsView.update(model.getSearchResultsPage());

    // 2. Update bookmarks
    bookmarksView.update(model.state.bookmarks);

    // 3. Load recipe from api
    await model.loadRecipe(id);

    // 4. Render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    // Catch error from 'model.js'
    // Render error in 'recipeiew.js'
    recipeView.renderError();
    console.error(err);
  }
};

//***********************************************//
// Search results
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Load search results based on query
    await model.loadSearchResults(query);

    // 3. Render initial results based on query
    resultsView.render(model.getSearchResultsPage()); // Render based on RESULTS_PER_PAGE
    // resultsView.render(model.state.search.results); // rendering all search results

    // 4. Render the initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

//***********************************************//
// Control Pagination
const controlPagination = function (goToPage) {
  // 3. Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2. Render NEW pagination buttons
  paginationView.render(model.state.search);
};

//***********************************************//
// Update recipe servings
const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe); // Render the entire view
  recipeView.update(model.state.recipe); // Only updates texts
};

//***********************************************//
// Control Bookmark
const controlAddBookmark = function () {
  // 1. Add/Remove Bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2. Update recipe View
  recipeView.update(model.state.recipe);

  // 3. Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

// Render bookmars as soon as the page loads
// Important for rendering the from the local storage
const controlLoadBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// Add own recipe
const addRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload Recipe
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Succes message
    addRecipeView.renderMessage();

    // Render Bookmark view
    bookmarksView.render(model.state.bookmarks);
    console.log(model.state.recipe);

    // Change ID in URL (without reloading)
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close modal window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err);
    console.error(err);
  }
};

//***********************************************//
// Publish-subscriber design pattern
const init = function () {
  bookmarksView.addHandlerRender(controlLoadBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHanderSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(addRecipe);
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
