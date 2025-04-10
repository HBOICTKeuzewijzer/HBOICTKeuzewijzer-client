import { Popper } from "@components"

/**
 * Sheet Web Component
 *
 * A custom element that represents a sheet (such as a modal or a side drawer),
 * which can be toggled open or closed via the `open` attribute.
 */
export class Popover extends Popper {
    constructor() {
        super()

        this.triggerElement = this.querySelector('[slot="trigger"]')
    }

    /**
     * Lifecycle method triggered when the component is added to the DOM.
     */
    connectedCallback() {
        requestAnimationFrame(() => {
            this.triggerElement?.addEventListener('click', () => this.open = !this.open)
        })
    }

    /**
     * Lifecycle method triggered when the component is removed from the DOM.
     */
    disconnectedCallback() {
        requestAnimationFrame(() => {
            this.triggerElement?.removeEventListener('click')
        })
    }
}
