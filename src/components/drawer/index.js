import template from './template.html?raw'
import styling from './style.css?raw'

/**
 * Creates a template for the Dialog component, including styles and HTML structure.
 */
const _template = document.createElement('template')
_template.innerHTML = `
    <style>${styling}</style>
    ${template}
`

/**
 * Dialog Web Component
 *
 * A base component for modal-like interfaces that can be shown/hidden.
 * Provides core functionality for managing visibility and accessibility.
 *
 * Attributes:
 * - `open`: Controls visibility of the dialog
 * - `disabled`: Disables interaction with the dialog
 *
 * Properties:
 * - `open`: Boolean getter/setter for visibility
 * - `disabled`: Boolean getter/setter for disabled state
 *
 * Example:
 * ```html
 * <x-dialog>
 *   <div>Dialog content here</div>
 * </x-dialog>
 * ```
 */
export class Dialog extends HTMLElement {
    /** @type {HTMLElement | null} */
    triggerElement = null
    /** @type {HTMLElement | null} */
    contentElement = null
    /** @type {HTMLElement | null} */
    backdropElement = null
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
        this.toggleAttribute('open', state)
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
        this.triggerElement = this.querySelector('[slot="trigger"]')
        this.contentElement = this.shadowRoot?.querySelector('[data-dialog]')
        this.backdropElement = this.shadowRoot?.querySelector('[data-backdrop]')
        this.closeButton = this.shadowRoot?.querySelector('[data-close]')

        if (this.hasAttribute('closable')) {
            this.backdropElement?.addEventListener('click', () => (this.open = false))
            this.closeButton?.addEventListener('click', () => (this.open = false))
        }

        this.contentElement?.setAttribute(
            'id',
            `dialog-${crypto.randomUUID?.() || Math.random().toString(36).slice(2, 9)}`,
        )

        this._updateAriaProperties()
    }

    /**
     * Lifecycle method triggered when the component is removed from the DOM.
     */
    disconnectedCallback() {
        if (this.hasAttribute('closable')) {
            this.backdropElement?.removeEventListener('click', () => (this.open = false))
            this.closeButton?.removeEventListener('click', () => (this.open = false))
        }
    }

    /**
     * Called when an observed attribute is changed.
     * @param {string} name - The name of the attribute that changed.
     * @param {string | null} oldValue - The previous value of the attribute.
     * @param {string | null} newValue - The new value of the attribute.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue !== oldValue && (name === 'open' || name === 'disabled')) {
            this.triggerElement?.toggleAttribute('disabled', this.hasAttribute('disabled').toString())
            this._updateAriaProperties()
        }
    }

    /**
     * Updates ARIA attributes based on dialog state.
     * @private
     */
    _updateAriaProperties() {
        this.triggerElement?.setAttribute('aria-expanded', this.open.toString())
        this.triggerElement?.setAttribute('aria-disabled', this.hasAttribute('disabled').toString())
        this.contentElement?.setAttribute('aria-hidden', (!this.open).toString())
    }
}
