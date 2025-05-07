import styling from './style.css?raw'
import { html } from '@utils/functions'
import CustomElement from '@components/customElement'

const template = html`
    <style>
        ${styling}
    </style>
    <div id="container">
        <slot class="icon-slot" name="prepend"></slot>
        <input type="text" />
        <slot class="icon-slot" name="append"></slot>
    </div>
    <div id="error-message" hidden></div>
`

export class Input extends CustomElement {
    static get observedAttributes() {
        return ['placeholder']
    }

    constructor() {
        super()
        this._error = ''
    }

    get placeholder() {
        return this.getAttribute('placeholder')
    }

    set placeholder(value) {
        this.setAttribute('placeholder', value)
    }

    get value() {
        const input = this.shadowRoot?.querySelector('input')
        return input?.value || ''
    }

    set value(val) {
        const input = this.shadowRoot?.querySelector('input')
        if (input) input.value = val
    }

    get error() {
        return this._error
    }

    set error(message) {
        this._error = message
        const container = this.shadowRoot?.getElementById('container')
        const errorMessage = this.shadowRoot?.getElementById('error-message')

        if (container && errorMessage) {
            if (message) {
                container.classList.add('error')
                errorMessage.textContent = message
                errorMessage.hidden = false
            } else {
                container.classList.remove('error')
                errorMessage.textContent = ''
                errorMessage.hidden = true
            }
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'placeholder' && this.shadowRoot) {
            const input = this.shadowRoot.querySelector('input')
            if (input) {
                input.placeholder = newValue
            }
        }
    }

    disconnectedCallback() {
        const input = this.shadowRoot.querySelector('input')
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
        this.hideEmptySlots()

        const input = this.shadowRoot.querySelector('input')
        if (!input) return

        input.placeholder = this.placeholder
        input.addEventListener('input', this.#inputHandler)
    }

    clear() {
        const input = this.shadowRoot?.querySelector('input')
        if (input) {
            input.value = ''
        }

        this.error = ''

        this.dispatchEvent(
            new CustomEvent('onValueChanged', {
                detail: { query: '' },
                bubbles: true,
                composed: true,
            })
        )
    }
}
