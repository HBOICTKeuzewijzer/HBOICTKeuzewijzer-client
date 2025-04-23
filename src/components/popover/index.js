import { Popper } from '@components'
import styling from './style.css?raw'

/**
 * <x-popover>
 *
 * A reusable Web Component for popovers (floating panels) that toggles on trigger interaction.
 * Handles visibility, positioning via Popper, accessibility, and user interactions.
 *
 * Attributes:
 * - `open`     : Boolean - shows/hides the popover
 * - `position` : String  - popover placement (e.g., "top", "bottom", "left", "right")
 * - `disabled` : Boolean - disables user interaction (no toggle)
 * - `closable` : Boolean - enables closing via clicking outside or Escape key
 *
 * Slots:
 * - `trigger`  : The element that toggles the popover (e.g., a button)
 * - *default*  : The content of the popover
 *
 * Example:
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
        if (event.key === 'Escape' && this.open) this.open = false
    }

    /**
     * Closes the popover when clicking outside the component.
     * @private
     */
    #handleOutsideClick = event => {
        if (!this.contains(event.target) && !this.triggerElement?.contains(event.target) && this.open) {
            this.open = false
        }
    }
}
