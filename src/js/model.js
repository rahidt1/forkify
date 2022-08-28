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
  bookmarks: [],
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

    // Reset Page after every search
    state.search.page = 1;
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

export const addBookmark = function (recipe) {
  // Add Bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as Bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.d === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT Bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
};
