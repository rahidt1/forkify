// import icons from '../../img/icons.svg'; //Parcel 1
import icons from 'url:../../img/icons.svg'; //Parcel 2

import View from './View.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const currPage = this._data.page;

    // Page 1 and there are other pages
    if (currPage === 1 && numPages > 1) {
      return this._generateMarkupNextBtn(currPage);
    }

    // Last page
    if (currPage === numPages && numPages > 1) {
      return this._generateMarkupPrevBtn(currPage);
    }

    // Other page
    if (currPage < numPages) {
      return `${this._generateMarkupPrevBtn(
        currPage
      )}${this._generateMarkupNextBtn(currPage)}`;
    }

    // Page 1 and there are no other pages
    return ``;
  }
  _generateMarkupPrevBtn(currPage) {
    return `
        <button data-goto= ${
          currPage - 1
        } class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
        </button>
    `;
  }
  _generateMarkupNextBtn(currPage) {
    return `
        <button data-goto= ${
          currPage + 1
        } class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}}#icon-arrow-right"></use>
            </svg>
        </button>
    `;
  }
}

export default new PaginationView();
