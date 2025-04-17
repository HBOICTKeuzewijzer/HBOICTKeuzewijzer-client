import { html } from '@/utils/functions';
import CustomElement from '@components/customElement';
import styling from './style.css?raw'

const template = html`
<style>${styling}</style>
<textarea spellcheck="false"></textarea>
`

export class InputMultiline extends CustomElement {
    static get observedAttributes() {
        return ['placeholder'];
    }

    constructor() {
        super();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'placeholder' && this.shadowRoot) {
            const input = this.shadowRoot.querySelector('textarea');
            if (input) {
                input.placeholder = newValue;
            }
        }
    }

    disconnectedCallback() {
        const input = this.shadowRoot.querySelector('textarea');
        if (input && this._inputHandler) {
            input.removeEventListener('input', this._inputHandler);
        }
    }

    #inputHandler = (event) => {
        const value = e.target.value;
        this.dispatchEvent(new CustomEvent('onValueChanged', {
            detail: { query: value },
            bubbles: true,
            composed: true
        }));
    }

    connectedCallback() {
        this.applyTemplate(template);

        const input = this.shadowRoot.querySelector('textarea');
        if (!input) return;

        input.placeholder = this.getAttribute('placeholder') || '';

        input.addEventListener('input', this.#inputHandler);
    }
}