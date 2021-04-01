import view from './Views.js';
import icons from 'url:../../img/icons.svg';

class AddrecipeView extends view {
  constructor() {
    super();
    this.parentElement = document.querySelector('.upload');
    this.window = document.querySelector('.add-recipe-window');
    this.overlay = document.querySelector('.overlay');
    this.btnOpen = document.querySelector('.nav__btn--add-recipe');
    this.btnClose = document.querySelector('.btn--close-modal');
    this.addHandlerShowWindow();
    this.addHandlerHideWindow();
    this.errorMessage =
      'wrong ingredient format! Please use the correct format :)';
    this.message = 'Recipe Was Successfully Uploaded :)';
  }
  toggleWindow() {
    this.overlay.classList.toggle('hidden');
    this.window.classList.toggle('hidden');
  }
  addHandlerShowWindow() {
    this.btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerHideWindow() {
    this.btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this.overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this.parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = Object.fromEntries([...new FormData(this)]);

      // const newData = {};
      // for (let i = 0; i < data.length; i++) {
      //   newData[data[i][0]] = data[i][1];
      // }

      handler(data);
    });
  }
}

export default new AddrecipeView();
