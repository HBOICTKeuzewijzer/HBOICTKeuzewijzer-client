import { Popper } from '@components'
import { KeyboardNavigable } from '@traits'
import { composeTraits } from '@utils'
import styling from './style.css?raw'

/**
 * `<x-popover>`
 *
 * A reusable Web Component for popovers (floating UI panels) that toggle visibility
 * based on trigger interaction. Inherits from `Popper` for positioning logic.
 *
 * ### Attributes:
 * - `open`      — Boolean. Controls visibility of the popover.
 * - `position`  — String. Sets the position of the popover (`top`, `bottom`, `left`, `right`, etc.).
 * - `disabled`  — Boolean. Prevents interaction (popover won't toggle).
 * - `closable`  — Boolean. Enables auto-closing when clicking outside or pressing `Escape`.
 *
 * ### Slots:
 * - `trigger`   — The element used to open/close the popover (e.g., a button).
 * - *default*   — The popover content itself.
 *
 * ### Example:
 * ```html
 * <x-popover position="bottom" closable>
 *   <button slot="trigger">Open Menu</button>
 *   <div class="menu" role="menu">
 *     <a href="#" role="menuitem">Option 1</a>
 *     <a href="#" role="menuitem">Option 2</a>
 *   </div>
 * </x-popover>
 * ```
 */
export class Popover extends composeTraits(Popper, KeyboardNavigable) {
    constructor() {
        super()

        /**
         * Scoped popover styles injected into the shadow DOM.
         * @type {HTMLStyleElement}
         * @private
         */
        const _styleElement = document.createElement('style')
        _styleElement.textContent = styling
        this.shadowRoot.appendChild(_styleElement)
    }

    /**
     * Called automatically when the element is inserted into the DOM.
     * Sets up event listeners for click toggling, outside click, and Escape key handling.
     *
     * @returns {void}
     */
    connectedCallback() {
        super.connectedCallback?.()

        this.triggerElement?.addEventListener('click', this._toggleHandler)
        document.addEventListener('keypress_escape', this._handleEscape)
        document.addEventListener('click', this.#handleOutsideClick)
    }

    /**
     * Called automatically when the element is removed from the DOM.
     * Cleans up event listeners to prevent memory leaks.
     *
     * @returns {void}
     */
    disconnectedCallback() {
        super.disconnectedCallback?.()

        this.triggerElement?.removeEventListener('click', this._toggleHandler)
        document.removeEventListener('keypress_escape', this._handleEscape)
        document.removeEventListener('click', this.#handleOutsideClick)
    }

    /**
     * Handles clicks outside the popover to close it, if open and closable.
     *
     * @param {MouseEvent} event - The mouse click event.
     * @private
     */
    #handleOutsideClick = event => {
        const isOutside = !this.contains(event.target) &&
                          !this.triggerElement?.contains(event.target)

        if (isOutside && this.open && this.hasAttribute('closable')) {
            this.open = false
        }
    }
}
