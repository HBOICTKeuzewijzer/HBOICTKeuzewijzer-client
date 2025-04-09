import styles from './studyCard.css?inline';

class YearHeader extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        shadow.innerHTML = `
      <style>${styles}</style>
      <div class="year-header">
        <slot></slot>
      </div>
    `;
    }
}

customElements.define('year-header', YearHeader);
