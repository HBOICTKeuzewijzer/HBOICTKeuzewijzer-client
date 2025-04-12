import { Popper } from '@components'
import styling from './style.css?raw'

/**
 * Tooltip Web Component
 *
 * A lightweight tooltip that shows on hover.
 * Provides simple hover-based interaction with inherited positioning.
 *
 * Features:
 * - Shows on hover
 * - Hides on mouse out
 * - Inherits positioning from Popper
 *
 * Example:
 * ```html
 * <x-tooltip position="top">
 *   <button slot="trigger">Hover me</button>
 *   <span>Helpful tooltip text</span>
 * </x-tooltip>
 * ```
 */
export class Tooltip extends Popper {
    constructor() {
        super()

        /** @type {HTMLStyleElement} */
        const _styleElement = document.createElement('style')
        _styleElement.textContent = styling
        this.shadowRoot.appendChild(_styleElement)
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

        this.triggerElement?.removeEventListener('mouseover', () => (this.open = true))
        this.triggerElement?.removeEventListener('mouseout', () => (this.open = false))
    }
}
