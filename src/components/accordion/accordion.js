import styles from './accordion.css?inline';

class Accordion extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = /*html*/`
      <style>${styles}</style>
      <div class="accordion-container">
        <button class="accordion" tabindex="0" aria-expanded="false" aria-controls="panel1">
          <slot name="title"></slot>
        </button>
        <div class="panel" id="panel1">
          <slot name="content"></slot>
        </div>
      </div>
    `;

    const acc = shadow.querySelectorAll('.accordion');
    acc.forEach((button) => {
      button.addEventListener('click', () => {
        const isExpanded = button.classList.toggle('active');
        button.setAttribute('aria-expanded', isExpanded);
        const panel = button.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    });
  }
}

customElements.define('custom-accordion', Accordion);
