import icons from 'url:../../img/icons.svg';

export default class Views {
  constructor() {
    this.data;
  }
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this.data = data;
    const markup = this._generateHtml();
    this._clear();
    this.parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    this.data = data;

    const newMarkup = this._generateHtml();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this.parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // updates text change
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      // updates attribute change
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this.parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
  <div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>
  `;
    this.parentElement.innerHTML = '';
    this.parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError() {
    const html = `
     <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${this.errorMessage}</p>
      </div>
    `;
    this._clear();
    this.parentElement.insertAdjacentHTML('afterbegin', html);
  }
  renderMessage() {
    const html = `
  <div class="recipe">
        <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${this.message}</p>
        </div>
    `;
    this._clear();
    this.parentElement.insertAdjacentHTML('afterbegin', html);
  }
}
