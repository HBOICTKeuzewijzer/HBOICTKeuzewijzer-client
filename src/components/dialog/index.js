import { AriaReflector, Openable } from '@traits'
import { composeTraits } from '@utils'
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
export class Dialog extends composeTraits(HTMLElement, Openable, AriaReflector) {
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
     * @returns {string[]}
     */
    static get observedAttributes() {
        return ['disabled']
    }

    connectedCallback() {
        super.connectedCallback?.();

        this.triggerElement = this.querySelector('[slot="trigger"]')
        this.contentElement = this.shadowRoot?.querySelector('[data-dialog]')
        this.backdropElement = this.shadowRoot?.querySelector('[data-backdrop]')
        this.closeButton = this.shadowRoot?.querySelector('[data-close]')

        this.contentElement?.setAttribute('role', this.contentElement?.getAttribute('role') || 'dialog')

        this.triggerElement?.addEventListener('click', this._openHandler)
        if (this.hasAttribute('closable')) {
            this.backdropElement?.addEventListener('click', this._closeHandler)
            this.closeButton?.addEventListener('click', this._closeHandler)
        }

        this.contentElement?.setAttribute('id', `dialog-${crypto.randomUUID?.() || Math.random().toString(36).slice(2, 10)}`)

        this.#updateAriaProperties()
    }

    disconnectedCallback() {
        super.disconnectedCallback?.();

        this.triggerElement?.removeEventListener('click', this._openHandler)
        if (this.hasAttribute('closable')) {
            this.backdropElement?.removeEventListener('click', this._closeHandler)
            this.closeButton?.removeEventListener('click', this._closeHandler)
        }
    }

    /**
     * Called when an observed attribute is changed.
     * @param {string} name
     * @param {string | null} oldValue
     * @param {string | null} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback?.(name, oldValue, newValue);

        if (newValue !== oldValue) {
            if (name === 'open') {
                this.triggerElement?.toggleAttribute('disabled', !this.open)
                this.contentElement?.setAttribute('aria-hidden', !this.open)
            }
        }
    }

    /**
     * Updates ARIA attributes based on dialog state.
     * @private
     */
    #updateAriaProperties() {
        if (!this.triggerElement || !this.contentElement) return

        this.triggerElement.setAttribute('aria-expanded', String(this.open))
        this.triggerElement.setAttribute('aria-disabled', String(this.hasAttribute('disabled')))
        this.triggerElement.setAttribute('aria-controls', this.contentElement.id)
        this.contentElement.setAttribute('aria-hidden', String(!this.open))
    }
}
