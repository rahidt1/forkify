// import icons from '../../img/icons.svg'; //Parcel 1
import icons from 'url:../../img/icons.svg'; //Parcel 2

import View from './View.js';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe found for your query! Please try again.';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
  // My solution (Not appropriate according to our architecture (MVC))
  // Because _generateMarkup() method should always be called by render() method  according to our architecture
  // So we can't directly call from here
  /*
  _generateMarkup() {
    return this._data.map(previewView._generateMarkup).join('');
  }
  */
}

export default new ResultsView();
