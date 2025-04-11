import { Popper } from '@components'

/**
 * Tooltip Web Component
 *
 * A custom element that represents a tooltip, which appears on hover of a trigger element.
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

        this.triggerElement?.addEventListener('mouseover', () => (this.open = true))
        this.triggerElement?.addEventListener('mouseout', () => (this.open = false))
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
