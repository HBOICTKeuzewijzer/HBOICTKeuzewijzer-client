import template from './template.html?raw'
import styling from './style.css?raw'

/**
 * Creates a template for the Sheet component, including styles and HTML structure.
 */
const _template = document.createElement('template')
_template.innerHTML = `
    <style>${styling}</style>
    ${template}
`

export class Popper extends HTMLElement {
     /**
     * Specifies the observed attributes for the component.
     * @returns {string[]} List of attributes to observe.
     */
     static get observedAttributes() {
        return ['open', 'side', 'align']
    }

    constructor() {
        super()

        this.attachShadow({ mode: 'open' })
        this.shadowRoot.appendChild(_template.content.cloneNode(true))

        this.triggerElement = null
        this.contentElement = null
        this.side = 'bottom'
        this.align = 'right'
    }

    /**
     * Returns the current `open` state.
     * @returns {boolean}
     */
    get open() {
        return this.getAttribute('open')
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
     * Returns the content `side` alignment.
     * @returns {string}
     */
    get side() {
        return this.getAttribute('open')
    }

    /**
     * Sets the content `side` alignment.
     * @param {string}
     * @returns {this}
     */
    set side(placement) {
        this.setAttribute('side', placement)
    }

    /**
     * Returns the content `align` alignment.
     * @returns {string}
     */
    get align() {
        return this.getAttribute('align')
    }

    /**
     * Sets the content `align` alignment.
     * @param {string}
     * @returns {this}
     */
    set align(placement) {
        this.setAttribute('align', placement)
    }

    /**
     * Lifecycle method triggered when the component is added to the DOM.
     */
    connectedCallback() {
        this.triggerElement = this.querySelector('[slot="trigger"]')
        this.contentElement = this.shadowRoot.querySelector('[data-content]')

        if (!this.contentElement.id) 
            this.contentElement.id = `popper-content-` + Math.random().toString(36).slice(2, 9)

        if (this.triggerElement) {
            this.triggerElement.setAttribute('aria-controls', this.contentElement.id)
            this.triggerElement.setAttribute('aria-describedby', this.contentElement.id)
            this.triggerElement.setAttribute('aria-haspopup', 'true')
            this.triggerElement.setAttribute('aria-expanded', this.open.toString())
            this.triggerElement.setAttribute('tabindex', 
                this.triggerElement.tabIndex < 0 
                    ? '0' 
                    : this.triggerElement.tabIndex
            )
        }

        this.setAttribute('side', this.side)
        this.setAttribute('align', this.align)
    }

    /**
     * Lifecycle method triggered when the component is removed from the DOM.
     */
    disconnectedCallback() {

    }

    /**
     * Called when an observed attribute is changed.
     * @param {string} name - The name of the attribute that changed.
     * @param {string | null} oldValue - The previous value of the attribute.
     * @param {string | null} newValue - The new value of the attribute.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'open')
            this._updateAriaProperties();
    }

    _updateAriaProperties() {
        if (this.triggerElement) {
            this.triggerElement.setAttribute('aria-expanded', this.open.toString())
        }

        if (this.contentElement) {
            this.contentElement.setAttribute('aria-hidden', (!this.open).toString())
        }
    }
}