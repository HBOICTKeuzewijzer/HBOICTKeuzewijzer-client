import { Popper } from '@components'

/**
 * Popover Web Component
 *
 * A component that displays content in a floating panel, triggered by a click on a trigger element.
 */
export class Popover extends Popper {
    /**
     * Lifecycle method triggered when the component is added to the DOM.
     */
    connectedCallback() {
        super.connectedCallback()

        this.triggerElement?.addEventListener('click', () => (this.open = !this.open))
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') this.open = false
        })
        document.addEventListener('click', event => {
            if (!this.contains(event.target) && !this.triggerElement?.contains(event.target)) {
                this.open = false
            }
        })
    }

    /**
     * Lifecycle method triggered when the component is removed from the DOM.
     */
    disconnectedCallback() {
        super.disconnectedCallback()

        this.triggerElement?.removeEventListener('click')
        document.removeEventListener('keydown')
        document.removeEventListener('click')
    }
}
