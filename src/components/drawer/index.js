import template from './template.html?raw'
import styling from './style.css?raw'

/**
 * Creates a template for the Sheet component, including styles and HTML structure.
 */
const sheetTemplate = document.createElement('template')
sheetTemplate.innerHTML = `
    <style>${styling}</style>
    ${template}
`

/**
 * Sheet Web Component
 *
 * A custom element that represents a sheet (such as a modal or a side drawer),
 * which can be toggled open or closed via the `open` attribute.
 */
export class Drawer extends HTMLElement {
    /**
     * Specifies the observed attributes for the component.
     * @returns {string[]} List of attributes to observe.
     */
    static get observedAttributes() {
        return ['open', 'type']
    }

    constructor() {
        super()

        this.attachShadow({ mode: 'open' })
        this.shadowRoot.appendChild(sheetTemplate.content.cloneNode(true))

        /**
         * Reference to the internal sheet container element.
         * @type {HTMLElement | null}
         */
        this.container = this.shadowRoot.querySelector('[data-sheet]') || this.shadowRoot.firstElementChild
    }

    /**
     * Returns the current open state.
     * @returns {boolean}
     */
    get open() {
        return this.hasAttribute('open')
    }

    /**
     * Change the current open state.
     * @param {boolean} value
     * @returns {this}
     */
    set toggle(value) {
        value ? this.setAttribute('open', '') : this.removeAttribute('open')
    }

    /**
     * Lifecycle method triggered when the component is added to the DOM.
     */
    connectedCallback() {
        this.#updateState()
    }

    /**
     * Lifecycle method triggered when the component is removed from the DOM.
     */
    disconnectedCallback() {
        console.log('Custom element removed from page.')
    }

    /**
     * Called when an observed attribute is changed.
     * @param {string} name - The name of the attribute that changed.
     * @param {string | null} oldValue - The previous value of the attribute.
     * @param {string | null} newValue - The new value of the attribute.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.#updateState()
            this.dispatchEvent(new CustomEvent(`${name}-changed`, { detail: { oldValue, newValue } }))
        }
    }

    /**
     * Updates the sheet state based on the `open` attribute.
     * @private
     */
    #updateState() {
        const isOpen = this.open
        if (this.container) this.container.toggleAttribute('open', isOpen)
    }
}
