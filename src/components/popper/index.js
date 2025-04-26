import { Openable, AriaReflector } from '@traits'
import { composeTraits } from '@utils'
import template from './template.html?raw'
import styling from './style.css?raw'

/**
 * Creates a template for the Popper component, including styles and HTML structure.
 * This is inserted into the component’s shadow DOM.
 * @private
 */
const _template = document.createElement('template')
_template.innerHTML = `
    <style>${styling}</style>
    ${template}
`

/**
 * `<x-popper>`
 *
 * A Web Component that provides core logic for floating, positioned UI elements such as tooltips or popovers.
 * It manages visibility, ARIA attributes, positioning, and supports composition with traits like `Openable`.
 *
 * ### Attributes:
 * - `open`      — Boolean. Controls visibility of the content (used by the Openable trait).
 * - `disabled`  — Boolean. Disables interaction from the trigger element.
 * - `position`  — String. Sets directional placement (`top`, `bottom`, `left`, `right`).
 * - `placement` — String. Defines alignment (`start`, `center`, `end`).
 *
 * ### Slots:
 * - `trigger`   — The interactive element (e.g., a button) that controls the popper.
 * - *default*   — The content of the popper. Must have `data-content` and a `role` like `tooltip` or `dialog`.
 *
 * ### Example:
 * ```html
 * <x-popper position="bottom" placement="center">
 *   <button slot="trigger">Trigger</button>
 *   <div data-content role="tooltip">Tooltip text</div>
 * </x-popper>
 * ```
 */
export class Popper extends composeTraits(HTMLElement, Openable, AriaReflector) {
    /** @type {HTMLElement | null} */
    triggerElement
    /** @type {HTMLElement | null} */
    contentElement

    constructor() {
        super()

        // Attach shadow DOM and insert the template content
        this.attachShadow({ mode: 'open' }).appendChild(_template.content.cloneNode(true))

        // Set defaults for attributes if not already provided
        if (!this.hasAttribute('position')) this.setAttribute('position', (this.position = 'bottom'))
        if (!this.hasAttribute('placement')) this.setAttribute('placement', (this.placement = 'middle'))
    }

    /**
     * Attributes to observe for changes that may require updates to ARIA or visibility.
     * @returns {string[]} The list of observed attributes.
     */
    static get observedAttributes() {
        return ['open', 'disabled', 'position', 'placement']
    }

    /**
     * Gets the current `position` attribute.
     * @returns {string}
     */
    get position() {
        return this.getAttribute('position') ?? 'bottom'
    }

    /**
     * Sets the `position` attribute.
     * @param {string} location
     */
    set position(location) {
        this.setAttribute('position', location)
    }

    /**
     * Gets the current `placement` attribute.
     * @returns {string}
     */
    get placement() {
        return this.getAttribute('placement') ?? 'middle'
    }

    /**
     * Sets the `placement` attribute.
     * @param {string} location
     */
    set placement(location) {
        this.setAttribute('placement', location)
    }

    /**
     * Called when the component is added to the DOM.
     * Initializes references and accessibility attributes.
     */
    connectedCallback() {
        super.connectedCallback?.()

        this.triggerElement = this.querySelector('[slot="trigger"]')
        this.contentElement = this.shadowRoot.querySelector('[data-content]')

        // Generate a unique ID for accessibility linking
        const contentId = `popper-${crypto.randomUUID?.() || Math.random().toString(36).slice(2, 9)}`
        this.contentElement.id = contentId

        if (this.triggerElement) {
            this.triggerElement.setAttribute('aria-disabled', this.hasAttribute('disabled').toString())
            this.triggerElement.setAttribute('aria-controls', contentId)
            this.triggerElement.setAttribute('aria-describedby', contentId)
            this.triggerElement.setAttribute('aria-haspopup', 'true')
            this.triggerElement.setAttribute('aria-expanded', this.open.toString())
            this.triggerElement.setAttribute(
                'tabindex',
                this.triggerElement.tabIndex < 0 ? '0' : this.triggerElement.tabIndex.toString(),
            )
        }
    }

    /**
     * Called when one of the observed attributes changes.
     * Updates ARIA attributes and interactivity accordingly.
     *
     * @param {string} name - The name of the changed attribute.
     * @param {string | null} oldValue - The previous value.
     * @param {string | null} newValue - The new value.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback?.(name, oldValue, newValue)

        if (newValue === oldValue) return

        const isDisabledChanged = name === 'disabled'
        const isOpenChanged = name === 'open'

        if (isDisabledChanged || isOpenChanged) {
            const isDisabled = this.hasAttribute('disabled')
            const isOpen = this.open

            this.triggerElement?.toggleAttribute('disabled', isDisabled)
            this.triggerElement?.setAttribute('aria-disabled', isDisabled.toString())
            this.triggerElement?.setAttribute('aria-expanded', isOpen.toString())

            this.contentElement?.setAttribute('aria-hidden', (!isOpen).toString())
        }
    }
}
