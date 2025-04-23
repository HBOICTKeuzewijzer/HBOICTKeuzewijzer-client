import template from './template.html?raw'
import styling from './style.css?raw'

// Create and attach the component's shadow DOM template
const _template = document.createElement('template')
_template.innerHTML = `
    <style>${styling}</style>
    ${template}
`

/**
 * <x-dialog>
 *
 * A reusable Web Component for modal dialogs.
 * Handles visibility, accessibility, and user interaction.
 *
 * Attributes:
 * - `open`     : Boolean - shows/hides the dialog
 * - `disabled` : Boolean - disables interaction
 * - `closable` : Boolean - enables close interactions (click on backdrop or close button)
 *
 * Slots:
 * - `trigger` : An optional button or element to open the dialog
 *
 * Example:
 * ```html
 * <x-dialog closable>
 *   <button slot="trigger">Open</button>
 *   <div>Dialog content here</div>
 * </x-dialog>
 * ```
 */
export class Dialog extends HTMLElement {
    /** @type {HTMLElement | null} */
    contentElement = null
    /** @type {HTMLElement | null} */
    backdropElement = null
    /** @type {HTMLElement | null} */
    triggerElement = null
    /** @type {HTMLButtonElement | null} */
    closeButton = null

    constructor() {
        super()
        this.attachShadow({ mode: 'open' }).appendChild(_template.content.cloneNode(true))
    }

    /**
     * Specifies the observed attributes for the component.
     * @returns {string[]} List of attributes to observe.
     */
    static get observedAttributes() {
        return ['open', 'disabled']
    }

    /**
     * Returns the current `open` state.
     * @returns {boolean}
     */
    get open() {
        return this.hasAttribute('open')
    }

    /**
     * Sets the current `open` state.
     * @param {boolean}
     * @returns {this}
     */
    set open(state) {
        if (state) {
            this.setAttribute('open', '')
            this.removeAttribute('closing')
        } else {
            this.setAttribute('closing', '')

            this.contentElement?.addEventListener(
                'animationend',
                function handler() {
                    this.removeAttribute('open')
                    this.removeAttribute('closing')
                    this.contentElement?.removeEventListener('animationend', handler)
                }.bind(this),
                { once: true },
            )
        }
    }

    /**
     * Gets the current `disabled` state.
     * @param {boolean}
     * @returns {this}
     */
    get disabled() {
        return this.hasAttribute('disabled')
    }

    /**
     * Sets the current `disabled` state.
     * @param {boolean}
     * @returns {this}
     */
    set disabled(value) {
        this.toggleAttribute('disabled', value)
    }

    /**
     * Lifecycle method triggered when the component is added to the DOM.
     */
    connectedCallback() {
        this.contentElement = this.shadowRoot?.querySelector('[data-dialog]')
        this.backdropElement = this.shadowRoot?.querySelector('[data-backdrop]')
        this.closeButton = this.shadowRoot?.querySelector('[data-close]')
        this.triggerElement = this.querySelector('[slot="trigger"]')

        this.triggerElement?.addEventListener('click', this._openHandler)

        if (this.hasAttribute('closable')) {
            this.backdropElement?.addEventListener('click', this._closeHandler)
            this.closeButton?.addEventListener('click', this._closeHandler)
        }

        this.contentElement?.setAttribute(
            'id',
            `dialog-${crypto.randomUUID?.() || Math.random().toString(36).slice(2, 9)}`,
        )

        this.#updateAriaProperties()
    }

    /**
     * Lifecycle method triggered when the component is removed from the DOM.
     */
    disconnectedCallback() {
        this.triggerElement?.removeEventListener('click', this._openHandler)

        if (this.hasAttribute('closable')) {
            this.backdropElement?.removeEventListener('click', this._closeHandler)
            this.closeButton?.removeEventListener('click', this._closeHandler)
        }
    }

    /**
     * Called when an observed attribute is changed.
     * @param {string} name - The name of the attribute that changed.
     * @param {string | null} oldValue - The previous value of the attribute.
     * @param {string | null} newValue - The new value of the attribute.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if (name === 'disabled') this.triggerElement?.toggleAttribute('disabled', this.disabled)

            this.#updateAriaProperties()
        }
    }

    /**
     * Updates ARIA attributes based on dialog state.
     * @private
     */
    #updateAriaProperties() {
        this.triggerElement?.setAttribute('aria-expanded', this.open)
        this.triggerElement?.setAttribute('aria-disabled', this.hasAttribute('disabled'))
        this.contentElement?.setAttribute('aria-hidden', !this.open)
    }

    _openHandler = () => (this.open = true)
    _closeHandler = () => (this.open = false)
}
