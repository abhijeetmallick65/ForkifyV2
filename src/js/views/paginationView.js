import View from './Views.js';
import icons from 'url:../../img/icons.svg';

class paginationView extends View {
  constructor() {
    super();
    this.parentElement = document.querySelector('.pagination');
  }

  addHandlerclick(handler) {
    this.parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goto = +btn.dataset.goto;
      handler(goto);
    });
  }

  _generateHtml() {
    const currentPage = this.data.currentPage;
    const numPages = Math.ceil(
      this.data.results.length / this.data.resultsPerPage
    );
    //   page 1 and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return `
        <button data-goto="${
          currentPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>page ${currentPage + 1} </span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
`;
    }
    // page 1 and no other page
    if (currentPage === 1 && numPages === 1) {
      return '';
    }
    // last page
    if (currentPage === numPages && numPages > 1) {
      return `
      <button data-goto="${
        currentPage - 1
      }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>page ${currentPage - 1}</span>
          </button>
      `;
    }
    // other page
    if (currentPage < numPages && currentPage > 1) {
      return `
      <button data-goto="${
        currentPage - 1
      }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>page ${currentPage - 1}</span>
          </button>
          <button data-goto="${
            currentPage + 1
          }" class="btn--inline pagination__btn--next">
            <span>page ${currentPage + 1} </span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
    }
  }
}
export default new paginationView();
