import { Popper } from '@components'
import styling from './style.css?raw'

/**
 * Popover Web Component
 *
 * An interactive floating panel that shows on click.
 * Includes click-outside and escape key handling.
 *
 * Features:
 * - Click trigger to toggle
 * - Click outside to close
 * - Escape key to close
 * - Inherits positioning from Popper
 *
 * Example:
 * ```html
 * <x-popover position="bottom">
 *   <button slot="trigger">Open Menu</button>
 *   <div class="menu">
 *     <a href="#">Option 1</a>
 *     <a href="#">Option 2</a>
 *   </div>
 * </x-popover>
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

        this.triggerElement?.addEventListener('click', this.#handleTriggerClick)
        document.addEventListener('keydown', this.#handleEscape)
        document.addEventListener('click', this.#handleOutsideClick)
    }

    /**
     * Lifecycle method triggered when the component is removed from the DOM.
     */
    disconnectedCallback() {
        super.disconnectedCallback()

        this.triggerElement?.removeEventListener('click', this.#handleTriggerClick)
        document.removeEventListener('keydown', this.#handleEscape)
        document.removeEventListener('click', this.#handleOutsideClick)
    }

    /**
     * Toggles the popover open state.
     * @private
     */
    #handleTriggerClick = () => {
        this.open = !this.open
    }

    /**
     * Closes the popover when the Escape key is pressed.
     * @private
     */
    #handleEscape = event => {
        if (event.key === 'Escape') this.open = false
    }

    /**
     * Closes the popover when clicking outside the component.
     * @private
     */
    #handleOutsideClick = event => {
        if (!this.contains(event.target) && !this.triggerElement?.contains(event.target)) {
            this.open = false
        }
    }
}
