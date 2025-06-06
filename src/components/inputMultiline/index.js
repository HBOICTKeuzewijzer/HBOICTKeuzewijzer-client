import { html } from '@/utils/functions'
import CustomElement from '@components/customElement'
import styling from './style.css?raw'

const template = html`
    <style>
        ${styling}
    </style>
    <textarea spellcheck="false" style="resize: vertical;"></textarea>
`

export class InputMultiline extends CustomElement {
    static get observedAttributes() {
        return ['placeholder']
    }

    constructor() {
        super()
    }

    get placeholder() {
        return this.getAttribute('placeholder')
    }

    set placeholder(value) {
        this.setAttribute('placeholder', value)
    }

    get value() {
        const input = this.shadowRoot?.querySelector('textarea')
        return input?.value || ''
    }

    set value(val) {
        const input = this.shadowRoot?.querySelector('textarea')
        if (input) input.value = val
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'placeholder' && this.shadowRoot) {
            const input = this.shadowRoot.querySelector('textarea')
            if (input) {
                input.placeholder = newValue
            }
        }
    }

    disconnectedCallback() {
        const input = this.shadowRoot.querySelector('textarea')
        if (input && this._inputHandler) {
            input.removeEventListener('input', this._inputHandler)
        }
    }

    #inputHandler = e => {
        const value = e.target.value
        this.dispatchEvent(
            new CustomEvent('onValueChanged', {
                detail: { query: value },
                bubbles: true,
                composed: true,
            }),
        )
    }

    connectedCallback() {
        this.applyTemplate(template)

        const input = this.shadowRoot.querySelector('textarea')
        if (!input) return

        input.placeholder = this.placeholder

        input.addEventListener('input', this.#inputHandler)
    }
}
