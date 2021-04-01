import View from './Views.js';
import icons from 'url:../../img/icons.svg';
class BookmarksView extends View {
  constructor() {
    super();
    this.parentElement = document.querySelector('.bookmarks__list');
    this.message = '';
    this.errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it.';
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
  addHandlerBookmarks(handler) {
    window.addEventListener('load', handler);
  }
}
export default new BookmarksView();
