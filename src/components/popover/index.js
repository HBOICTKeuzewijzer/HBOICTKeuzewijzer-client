import { Popper } from '@components'
import styling from './style.css?raw'

/**
 * Popover Web Component
 *
 * A custom element that extends the `Popper` component to show or hide floating content
 * based on user interaction (click). It adds interactivity for toggling visibility, and
 * handles closing the popover when clicking outside or pressing the Escape key.
 *
 * Inherits from:
 * - `Popper`: Provides positioning, ARIA handling, and structure.
 *
 * Behavior:
 * - Clicking the trigger toggles the popover open/closed.
 * - Clicking outside the popover closes it.
 * - Pressing the Escape key closes it.
 *
 * Example usage:
 * ```html
 * <custom-popover>
 *   <button slot="trigger">Toggle Popover</button>
 *   <div>Popover content here</div>
 * </custom-popover>
 * ```
 */
export class Popover extends Popper {
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

        this.triggerElement?.addEventListener('click', this._handleTriggerClick)
        document.addEventListener('keydown', this._handleEscape)
        document.addEventListener('click', this._handleOutsideClick)
    }

    /**
     * Lifecycle method triggered when the component is removed from the DOM.
     */
    disconnectedCallback() {
        super.disconnectedCallback()

        this.triggerElement?.removeEventListener('click', this._handleTriggerClick)
        document.removeEventListener('keydown', this._handleEscape)
        document.removeEventListener('click', this._handleOutsideClick)
    }

    /**
     * Toggles the popover open state.
     * @private
     */
    _handleTriggerClick = () => {
        this.open = !this.open
    }

    /**
     * Closes the popover when the Escape key is pressed.
     * @private
     */
    _handleEscape = (event) => {
        if (event.key === 'Escape') {
            this.open = false
        }
    }

    /**
     * Closes the popover when clicking outside the component.
     * @private
     */
    _handleOutsideClick = (event) => {
        if (!this.contains(event.target) && !this.triggerElement?.contains(event.target)) {
            this.open = false
        }
    }
}
