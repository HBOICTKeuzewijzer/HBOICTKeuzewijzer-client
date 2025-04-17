import styling from './style.css?raw'
import { html } from '@utils/functions'
import CustomElement from '@components/customElement';

const template = html`
<style>${styling}</style>
<div id="container">          
    <slot class="icon-slot" name="prepend"></slot>
    <input type="text" />
    <slot class="icon-slot" name="append"></slot>
</div>
`

export class Input extends CustomElement {
    static get observedAttributes() {
        return ['placeholder'];
    }

    constructor() {
        super();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'placeholder' && this.shadowRoot) {
            const input = this.shadowRoot.querySelector('input');
            if (input) {
                input.placeholder = newValue;
            }
        }
    }

    disconnectedCallback() {
        const input = this.shadowRoot.querySelector('input');
        if (input && this._inputHandler) {
            input.removeEventListener('input', this._inputHandler);
        }
    }

    #inputHandler = (e) => {
        const value = e.target.value;
        this.dispatchEvent(new CustomEvent('onValueChanged', {
            detail: { query: value },
            bubbles: true,
            composed: true
        }));
    }

    connectedCallback() {
        this.applyTemplate(template);
        this.hideEmptySlots();

        const input = this.shadowRoot.querySelector('input');
        if (!input) return;

        input.placeholder = this.getAttribute('placeholder') || '';

        input.addEventListener('input', this.#inputHandler);
    }
}