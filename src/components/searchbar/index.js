import styling from './style.css?raw'

class SearchBar extends HTMLElement {
    static get observedAttributes() {
        return ['placeholder'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = /*html*/`
            <style>${styling}</style>
            <div id="container">          
                <slot class="icon-slot" name="prepend"></slot>
                <input type="text" />  
                <slot class="icon-slot" name="append"></slot>
            </div>
        `;

        this.#clearEmptySlots();
    }

    #clearEmptySlots() {
        let slots = this.shadowRoot.querySelectorAll('slot');

        slots.forEach(slot => {
            if (slot.assignedNodes().length === 0) {
                slot.style.display = 'none';
            } else {
                slot.style.display = '';
            }
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'placeholder' && this.shadowRoot) {
            const input = this.shadowRoot.querySelector('input');
            if (input) {
                input.placeholder = newValue;
            }
        }
    }

    connectedCallback() {
        const input = this.shadowRoot.querySelector('input');
        if (!input) return;

        input.placeholder = this.getAttribute('placeholder') || 'Zoeken';

        this._inputHandler = (e) => {
            const value = e.target.value;
            this.dispatchEvent(new CustomEvent('search', {
                detail: { query: value },
                bubbles: true,
                composed: true
            }));
        };

        input.addEventListener('input', this._inputHandler);
    }

    disconnectedCallback() {
        const input = this.shadowRoot.querySelector('input');
        if (input && this._inputHandler) {
            input.removeEventListener('input', this._inputHandler);
        }
    }
}

customElements.define('search-bar', SearchBar);