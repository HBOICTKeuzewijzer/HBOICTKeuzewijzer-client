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
        this.setAttribute('data-tooltip', '')
    }

    /**
     * Lifecycle method triggered when the component is added to the DOM.
     */
    connectedCallback() {
        super.connectedCallback()
        this.triggerElement?.addEventListener('mouseover', () => this.open = true)
        this.triggerElement?.addEventListener('mouseout', () => this.open = false)
    }

    /**
     * Lifecycle method triggered when the component is removed from the DOM.
     */
    disconnectedCallback() {
        super.disconnectedCallback()
        this.triggerElement?.removeEventListener('mouseover')
        this.triggerElement?.removeEventListener('mouseout')
    }
}
