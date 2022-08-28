// import icons from '../../img/icons.svg'; //Parcel 1
import icons from 'url:../../img/icons.svg'; //Parcel 2

import View from './View.js';
import previewView from './previewView.js';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
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

export default new BookmarksView();
