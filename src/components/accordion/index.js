import styles from './accordion.css?inline';

class Accordion extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    if (!document.head.querySelector('link[href="https://fonts.googleapis.com/icon?family=Material+Icons"]')) {
      const link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('href', 'https://fonts.googleapis.com/icon?family=Material+Icons');
      document.head.appendChild(link);
    }

    this.shadowRoot.innerHTML = /*html*/`
      <style>${styles}</style>
      <div class="accordion-container">
        <button class="accordion" tabindex="0" aria-expanded="false">
          <slot name="title"></slot>
        </button>
        <div class="panel">
          <slot name="content"></slot>
        </div>
      </div>
    `;

    this._onAccordionClick = this._onAccordionClick.bind(this);
  }

  connectedCallback() {
    this.accordionButton = this.shadowRoot.querySelector('.accordion');
    this.panel = this.shadowRoot.querySelector('.panel');
    if (this.accordionButton) {
      this.accordionButton.addEventListener('click', this._onAccordionClick);
    }
  }

  disconnectedCallback() {
    if (this.accordionButton) {
      this.accordionButton.removeEventListener('click', this._onAccordionClick);
    }
  }

  _onAccordionClick(event) {
    const button = event.currentTarget;
    const isExpanded = button.classList.toggle('active');
    button.setAttribute('aria-expanded', isExpanded);

    if (!this.panel) return;

    if (this.panel.style.maxHeight) {
      this.panel.style.removeProperty('max-height');
    } else {
      this.panel.style.maxHeight = this.panel.scrollHeight + 'px';
    }
  }
}

customElements.define('custom-accordion', Accordion);
