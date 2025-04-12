import template from './template.html?raw'
import styling from './style.css?raw'

/**
 * Creates a template for the Popper component, including styles and HTML structure.
 */
const _template = document.createElement('template')
_template.innerHTML = `
    <style>${styling}</style>
    ${template}
`

/**
 * Popper Web Component
 *
 * A base component for creating positioned floating elements.
 * Provides core positioning and ARIA functionality for tooltips and popovers.
 *
 * Attributes:
 * - `open`: Controls visibility
 * - `position`: Positioning ('top'|'right'|'bottom'|'left')
 * - `placement`: Alignment ['top' || 'bottom']('left'|'right'|'middle') && ['right' || 'left']('top'|'bottom'|'middle')
 *
 * Slots:
 * - `trigger`: Element that controls the popper
 * - default: Content to show in the popper
 *
 * Example:
 * ```html
 * <x-popper position="bottom" placement="center">
 *   <button slot="trigger">Trigger</button>
 *   <div>Popper content</div>
 * </x-popper>
 * ```
 */
export class Popper extends HTMLElement {
    /** @type {HTMLElement | null} */
    triggerElement
    /** @type {HTMLElement | null} */
    contentElement

    /**
     * Specifies the observed attributes for the component.
     * @returns {string[]} List of attributes to observe.
     */
    static get observedAttributes() {
        return ['open', 'disabled', 'position', 'placement']
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
     * Returns the content `position` alignment.
     * @returns {string}
     */
    get position() {
        return this.getAttribute('position')
    }

    /**
     * Sets the content `position` alignment.
     * @param {string}
     * @returns {this}
     */
    set position(location) {
        this.setAttribute('position', location)
    }

    /**
     * Returns the content `placement` alignment.
     * @returns {string}
     */
    get placement() {
        return this.getAttribute('placement')
    }

    /**
     * Sets the content `placement` alignment.
     * @param {string}
     * @returns {this}
     */
    set placement(location) {
        this.setAttribute('placement', location)
    }

    constructor() {
        super()

        this.attachShadow({ mode: 'open' }).appendChild(_template.content.cloneNode(true))

        if (!this.hasAttribute('position')) this.setAttribute('position', (this.position = 'bottom'))
        if (!this.hasAttribute('placement')) this.setAttribute('placement', (this.placement = 'middle'))
    }

    /**
     * Lifecycle method triggered when the component is added to the DOM.
     */
    connectedCallback() {
        this.triggerElement = this.querySelector('[slot="trigger"]')
        this.contentElement = this.shadowRoot.querySelector('[data-content]')

        //Define an unique ID for the ARIA attributes
        this.contentElement.id = `popper-${crypto.randomUUID?.() || Math.random().toString(36).slice(2, 9)}`

        this.triggerElement?.setAttribute('aria-disabled', this.hasAttribute('disabled'))
        this.triggerElement?.setAttribute('aria-controls', this.contentElement.id)
        this.triggerElement?.setAttribute('aria-describedby', this.contentElement.id)
        this.triggerElement?.setAttribute('aria-haspopup', 'true')
        this.triggerElement?.setAttribute('aria-expanded', this.open.toString())
        this.triggerElement?.setAttribute(
            'tabindex',
            this.triggerElement.tabIndex < 0 ? '0' : this.triggerElement.tabIndex,
        )
    }

    /**
     * Lifecycle method triggered when the component is removed from the DOM.
     */
    disconnectedCallback() {}

    /**
     * Called when an observed attribute is changed.
     * @param {string} name - The name of the attribute that changed.
     * @param {string | null} oldValue - The previous value of the attribute.
     * @param {string | null} newValue - The new value of the attribute.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue !== oldValue && (name === 'open' || name === 'disabled')) {
            this.triggerElement?.toggleAttribute('disabled', this.hasAttribute('disabled'))
            this.triggerElement?.setAttribute('aria-disabled', this.hasAttribute('disabled').toString())

            this.triggerElement?.setAttribute('aria-expanded', this.open.toString())
            this.contentElement?.setAttribute('aria-hidden', (!this.open).toString())
        }
    }
}
