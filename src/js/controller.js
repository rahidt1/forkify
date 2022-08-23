import * as model from './model.js';
import recipeView from './views/recipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Forkify API
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

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

// Publish-subscriber design pattern
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
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
