import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import SearchView from './views/SearchView.js';
import resultsView from './views/resultsView.js';
import BookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import AddrecipeView from './views/addRecipeView.js';
// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// controlRecipes
const controlRecipes = async function () {
  try {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    // spinner
    recipeView.renderSpinner();

    // updates results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // load recipe
    await model.loadRecipe(hash);

    // render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

// control Search Results
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // get query
    const query = SearchView.getQuery();
    if (!query) return;

    // get results
    await model.loadSearchResults(query);

    // render results
    // resultsView.render(model.state.Search.results);
    resultsView.render(model.getSearchResultsPage());

    // pagination render
    paginationView.render(model.state.Search);
  } catch (error) {
    console.log(error);
  }
};

// control pagination
const pagination = function (gotoPage) {
  // render results
  resultsView.render(model.getSearchResultsPage(gotoPage));

  // pagination render
  paginationView.render(model.state.Search);
};

// control servings
const controlServing = function (newServings) {
  // update recipe servings (in state)
  model.updateServings(newServings);
  // update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

// control add bookmark
const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

// control bookmarks
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// control recipe upload
const controlRecipeUpload = async function (data) {
  try {
    // add loading spinner
    AddrecipeView.renderSpinner();

    // upload the new recipe data
    await model.uploadRecipe(data);
    console.log(model.state.recipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // success message
    AddrecipeView.renderMessage();

    // render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form window
    setTimeout(function () {
      AddrecipeView.toggleWindow();
    }, 2.5 * 1000);

    // reload
    window.location.reload();
  } catch (error) {
    AddrecipeView.renderError(error);
  }
};

// initialisation function
const init = function () {
  bookmarksView.addHandlerBookmarks(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServing);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  SearchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerclick(pagination);
  AddrecipeView.addHandlerUpload(controlRecipeUpload);
};
init();
