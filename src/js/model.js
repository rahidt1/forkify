import { async } from 'regenerator-runtime';
import { API_URL, RESULTS_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

//***********************************************//
// All data
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    page: 1, // By default page is 1
  },
  bookmarks: [],
};

/**
 * Format data coming from the API
 * @param {Object} data The data to be formatted according to our need
 * @returns {Object} Object that we store in our local storage
 */
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
    /*
    // recipe.key exist? if so, it returns { key: recipe.key }
    // else '&&' short circuits and returns undefined
    // ...undefined  returns nothing
    // ...{ key: recipe.key } returns key: recipe.key
    Example: ...{ key1: 1, key2: 2} -> key1: 1, key2: 2
    */
  };
};

//***********************************************//
/**
 * Getting a particular recipe from API.
 * @param {string} id of the particular recipe
 * @returns {undefined}
 * Add (store) the current recipe in state.
 * Check if the recipe is bookmarked or not, change the state accordingly.
 */
export const loadRecipe = async function (id) {
  try {
    // Here an async function (loadRecipe) calling an async function (getJSON)
    // As async function return a promise, here we are handling the promise using await
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);
    console.log(state);

    // Check if the recipe is bookmarked or not
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    // Catch error from 'helpers.js'
    // Re-throwing error, because we want to handle the error in 'controller.js', not here
    throw err;
    // console.error(err);
  }
};

//***********************************************//
// Search Result
/**
 * Get the search result from API based on query
 * @param {string} query The recipe to be searched (e.g. Pizza)
 * @returns {undefined}
 */
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        image: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
        ...(rec.key && { key: rec.key }),
      };
    });

    // Reset Page after every search
    state.search.page = 1;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

/**
 * Render number of results per page
 * @param {*} page No. of recipe to rendered
 * @returns {Number} No. of results to be rendered
 */
export const getSearchResultsPage = function (page = state.search.page) {
  // Storing the page number in state
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // (page=1-1)*10=0
  const end = page * state.search.resultsPerPage; // page*10=10

  return state.search.results.slice(start, end); // 0-9 Slice method dont include last number
};

//***********************************************//
/**
 * Update recipe according to no. of servings
 * @param {Number} newServings Update the quantity of recipes based on this
 */
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    // newQuantity = (oldQuantity * newServings) / oldServings
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

//***********************************************//
// Bookmarks
const storeBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add Bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as Bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  storeBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.d === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT Bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  // Store Bookmarks in local storage
  storeBookmarks();
};

// Get data from local storage as soon as page loads
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

/**
 * Clear bookmarks from local storage (for dev purpose only)
 */
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

//***********************************************//
/**
 * Upload recipe to the API
 * @param {Object} newRecipe Recipe to be uploaded in the API
 */
// It makes a request to the API, hence 'async' function
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());

        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format. Please use the correct format.'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    // Error occured in async function, retuned as fulfilled promise, so we have to re-throw the error to catch it
    throw err;
  }
};
