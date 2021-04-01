import { async } from 'regenerator-runtime';
import { API_URL } from './config.js';
import { getJSON } from './helper.js';
import { sendJSON } from './helper.js';
import { PERPAGE } from './config.js';
import { KEY } from './config.js';
export const state = {
  recipe: {},
  Search: {
    query: '',
    results: [],
    currentPage: 1,
    resultsPerPage: PERPAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (hash) {
  try {
    const data = await getJSON(`${API_URL}/${hash}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    state.Search.currentPage = 1;
    if (state.bookmarks.some(bookmark => bookmark.id === hash))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    // console.log(err);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const { data } = await getJSON(`${API_URL}/?search=${query}&key=${KEY}`);
    state.Search.results = data.recipes.map(e => {
      return {
        id: e.id,
        title: e.title,
        publisher: e.publisher,
        image: e.image_url,
        ...(e.key && { key: e.key }),
      };
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.Search.currentPage) {
  state.Search.currentPage = page;
  const start = (page - 1) * state.Search.resultsPerPage;
  const end = page * state.Search.resultsPerPage;
  return state.Search.results.slice(start, end);
};

export const updateServings = function (servings) {
  state.recipe.ingredients.forEach(e => {
    e.quantity = (servings * e.quantity) / state.recipe.servings;
  });
  state.recipe.servings = servings;
};

const persisitBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // add Bookmark
  state.bookmarks.push(recipe);

  // mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persisitBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(e => e.id === id);
  state.bookmarks.splice(index, 1);
  // mark current recipe as bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persisitBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(arr => {
        // const ingArr = arr[1].replaceAll(' ', '').split(',');
        const ingArr = arr[1].split(',').map(e => e.trim());

        if (ingArr.length !== 3)
          throw new Error(
            'wrong ingredient format! Please use the correct format :)'
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
    console.log(recipe);
    const data = await sendJSON(
      `https://forkify-api.herokuapp.com/api/v2/recipes?key=${KEY}`,
      recipe
    );
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
    console.log(data);
  } catch (err) {
    throw err;
  }
};
