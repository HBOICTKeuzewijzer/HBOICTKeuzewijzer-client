import { Popper } from '@components'

/**
 * Popper Web Component
 *
 * A custom element that represents a sheet (such as a modal or a side drawer),
 * which can be toggled open or closed via the `open` attribute.
 */
export class Tooltip extends Popper {
    constructor() {
        super()

        this.triggerElement = this.querySelector('[slot="trigger"]')
        this.setAttribute('data-tooltip', '')
    }

    /**
     * Lifecycle method triggered when the component is added to the DOM.
     */
    connectedCallback() {
        requestAnimationFrame(() => {
            this.triggerElement?.addEventListener('mouseover', () => this.open = true)
            this.triggerElement?.addEventListener('mouseout', () => this.open = false)
        })
    }

    /**
     * Lifecycle method triggered when the component is removed from the DOM.
     */
    disconnectedCallback() {
        requestAnimationFrame(() => {
            this.triggerElement?.removeEventListener('mouseover')
            this.triggerElement?.removeEventListener('mouseout')
        })
    }

    /**
     * Called when an observed attribute is changed.
     * @param {string} name - The name of the attribute that changed.
     * @param {string | null} oldValue - The previous value of the attribute.
     * @param {string | null} newValue - The new value of the attribute.
     */
    attributeChangedCallback(name, oldValue, newValue) {
    }
}
