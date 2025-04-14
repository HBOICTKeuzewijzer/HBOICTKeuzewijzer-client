import styling from './style.css?raw'
import { html } from '@utils/functions'

const template = html`
<style>${styling}</style>
<div id="container">          
    <slot class="icon-slot" name="prepend"></slot>
    <input type="text" />
    <slot class="icon-slot" name="append"></slot>
</div>
`

class CustomElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    applyTemplate(template) {
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    clearEmptySlots() {
        const slots = this.shadowRoot.querySelectorAll('slot');

        slots.forEach(slot => {
            if (slot.assignedNodes().length === 0) {
                slot.style.display = 'none';
            } else {
                slot.style.display = '';
            }
        });
    }
}


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

    connectedCallback() {
        this.applyTemplate(template);
        this.clearEmptySlots();

        const input = this.shadowRoot.querySelector('input');
        if (!input) return;

        input.placeholder = this.getAttribute('placeholder') || '';

        this._inputHandler = (e) => {
            const value = e.target.value;
            this.dispatchEvent(new CustomEvent('onValueChanged', {
                detail: { query: value },
                bubbles: true,
                composed: true
            }));
        };

        input.addEventListener('input', this._inputHandler);
    }
}
