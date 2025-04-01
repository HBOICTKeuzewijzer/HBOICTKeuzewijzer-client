import template from './template.html?raw'
import styling from './style.css?raw'

const sheetTemplate = document.createElement('template');
sheetTemplate.innerHTML = `
    <style>${styling}</style>
    ${template}
`;

export class Sheet extends HTMLElement {
    static get observedAttributes() {
        return ['open', 'type']
    }

    constructor() {
        super()

        this.attachShadow({ mode: 'open' })
        this.shadowRoot.appendChild(sheetTemplate.content.cloneNode(true));

        // Reference the internal element (assuming there's a main wrapper)
        this.container = this.shadowRoot.querySelector('[data-sheet]') || this.shadowRoot.firstElementChild;
    }

    /**
     * Returns the current open state.
     * @returns {boolean}
    */
    get open() { return this.hasAttribute('open') }

    /**
     * Change the current open state.
     * @param {boolean} value
     * @returns {this}
    */
    set toggle(value) {
        value
            ? this.setAttribute('open', '')
            : this.removeAttribute('open')
    }

    connectedCallback() {
        this.#updateState();
    }

    disconnectedCallback() {
        console.log('Custom element removed from page.')
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.#updateState();
            this.dispatchEvent(new CustomEvent(`${name}-changed`, { detail: { oldValue, newValue } }));
        }
    }

    #updateState() {
        const isOpen = this.open;
        if (this.container) this.container.toggleAttribute('open', isOpen);
    }
}
