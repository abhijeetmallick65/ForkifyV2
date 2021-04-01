import View from './Views.js';
import icons from 'url:../../img/icons.svg';
class ResultsView extends View {
  constructor() {
    super();
    this.parentElement = document.querySelector('.results');
    this.message = '';
    this.errorMessage =
      'We could not find the any recipe for your query. Please try agin :)';
  }
  _generateHtml() {
    const markup = this.data.map(e => this._generateHtmlPreview(e));
    return markup;
  }
  _generateHtmlPreview(e) {
    const id = window.location.hash.slice(1);

    return `
         <li class="preview">
            <a class="preview__link ${
              e.id === id ? 'preview__link--active' : ''
            }" href="#${e.id}">
              <figure class="preview__fig">
                <img src=${e.image} />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${e.title}</h4>
                <p class="preview__publisher">${e.publisher}</p>
                     <div class="preview__user-generated ${
                       e.key ? '' : 'hidden'
                     }">
                <svg>
                  <use href="${icons}#icon-user"></use>
                </svg>
              </div>
              </div> 
              </a>
          </li>
      `;
  }
}
export default new ResultsView();
