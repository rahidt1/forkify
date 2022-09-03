// import icons from '../../img/icons.svg'; //Parcel 1
import icons from 'url:../../img/icons.svg'; //Parcel 2

import View from './View.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded :)';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  // As addEventListener is attached to _btnOpen, the 'this' keyword is point to _btnOpen.
  // So we export the functionality in toggleWindow & bind the 'this' keyword
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      // FormData collects all the data from Form at once
      const dataArr = [...new FormData(this)]; // 'this' points to '.upload'

      const data = Object.fromEntries(dataArr); // Create key-value pair from array (iterables)

      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
