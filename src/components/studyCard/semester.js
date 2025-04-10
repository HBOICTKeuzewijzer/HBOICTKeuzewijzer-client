import styles from './studyCard.css?inline';

class Semester extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        shadow.innerHTML = `
      <style>${styles}</style>
      <div class="semester">
        <p><slot></slot></p>
      </div>
    `;
    }

    connectedCallback() {
        this.updateStyles();
    }

    updateStyles() {
        const content = this.textContent.trim();
        if (content.toLowerCase().includes('basisconcepten')) {
            this.shadowRoot.querySelector('.semester').classList.add('locked');
        } else {
            this.shadowRoot.querySelector('.semester').classList.add('keuze-dotted');
        }
    }
}

customElements.define('study-semester', Semester);
