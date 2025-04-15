import styles from './accordion.css?inline';

class Accordion extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = /*html*/`
      <style>${styles}</style>
      <div class="accordion-container">
        <button class="accordion" tabindex="0" aria-expanded="false">
          <slot name="title"></slot>
          <svg class="accordion-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            <path d="M200,136H136v64a8,8,0,0,1-16,0V136H56a8,8,0,0,1,0-16h64V56a8,8,0,0,1,16,0v64h64a8,8,0,0,1,0,16Z"/>
          </svg>
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
    const isExpanded = button.classList.toggle('open');
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
