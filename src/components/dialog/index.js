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
 * A custom HTML element that displays a modal dialog with an optional
 * backdrop, close button, and fully ARIA-compliant accessibility support.
 * Dialogs are toggled via the `open` attribute, and can be triggered
 * by slotted buttons using the `trigger` slot.
 *
 * Attributes:
 * - `open`     : Shows/hides the dialog.
 * - `disabled` : Disables interaction.
 * - `closable` : Adds a close button and enables clicking backdrop to close.
 * - `backdrop` : Displays a dimmed background when dialog is open.
 *
 * Slots:
 * - `trigger`  : Interactive element that opens the dialog.
 * - default    : Content of the dialog.
 *
 * Example:
 * ```html
 * <custom-dialog open closable backdrop>
 *   <button slot="trigger">Open Dialog</button>
 *   <h2 id="dialogTitle">Title</h2>
 *   <p id="dialogDescription">More info</p>
 * </custom-dialog>
 * ```
 */
export class Dialog extends HTMLElement {
    /**
     * Specifies the observed attributes for the component.
     * @returns {string[]} List of attributes to observe.
     */
    static get observedAttributes() {
        return ['open', 'disabled'];
    }

    constructor() {
        super()

        this.attachShadow({ mode: 'open' })
            .appendChild(_template.content.cloneNode(true))

        /** @type {HTMLElement | null} */
        this.triggerElement = null
        /** @type {HTMLElement | null} */
        this.contentElement = null
        /** @type {HTMLElement | null} */
        this.backdropElement = null
        /** @type {HTMLButtonElement | null} */
        this.closeButton = null
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
     * Lifecycle method triggered when the component is added to the DOM.
     */
    connectedCallback() {
        this.triggerElement = this.querySelector('[slot="trigger"]')
        this.contentElement = this.shadowRoot?.querySelector('[data-dialog]')
        this.backdropElement = this.shadowRoot?.querySelector('[data-backdrop]')
        this.closeButton = this.shadowRoot?.querySelector('[data-close]')
        
        this._setupEvents()

        this.contentElement?.setAttribute('id', `dialog-${crypto.randomUUID?.() || Math.random().toString(36).slice(2, 9)}`)
        this.contentElement.setAttribute('role', 'dialog')
        this.contentElement.setAttribute('aria-modal', 'true')
        this.contentElement.setAttribute('tabindex', '-1')
    
        this._updateAriaProperties()
    }

    /**
     * Lifecycle method triggered when the component is removed from the DOM.
     */
    disconnectedCallback() {
        this.backdropElement?.removeEventListener('click', this._handleCloseClick)
        this.closeButton?.removeEventListener('click', this._handleCloseClick)
    }

    /**
     * Called when an observed attribute is changed.
     * @param {string} name - The name of the attribute that changed.
     * @param {string | null} oldValue - The previous value of the attribute.
     * @param {string | null} newValue - The new value of the attribute.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue !== oldValue && (name === 'open' || name === 'disabled')) {
            this._updateAriaProperties()
        }
    }

    /**
     * Sets up close behavior for the backdrop and close button, if applicable.
     * @private
     */
    _setupEvents() {
        if (!this.hasAttribute('closable')) return

        this._handleCloseClick = () => this.open = false

        this.backdropElement?.addEventListener('click', this._handleCloseClick)
        this.closeButton?.addEventListener('click', this._handleCloseClick)
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
