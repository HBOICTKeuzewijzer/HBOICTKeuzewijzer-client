import { Popper } from '@components'
import styling from './style.css?raw'

/**
 * `<x-tooltip>`
 *
 * A lightweight and accessible tooltip Web Component.
 * Inherits positioning logic from the `Popper` component.
 * Displays tooltip content when the trigger element is hovered or focused.
 *
 * ### Attributes:
 * - `position` — Optional. Placement of the tooltip. One of `'top' | 'right' | 'bottom' | 'left'`.
 * - `delay` — Optional. Number of milliseconds to delay show/hide actions (default: 0).
 *
 * ### Slots:
 * - `trigger` — Required. An interactive element (like a button) that triggers the tooltip.
 * - (default) — Required. The tooltip content, annotated with `data-content` and `role="tooltip"`.
 *
 * ### Example:
 * ```html
 * <x-tooltip position="top" delay="200">
 *   <button slot="trigger">Hover me</button>
 *   <span data-content role="tooltip">Helpful tooltip text</span>
 * </x-tooltip>
 * ```
 */
export class Tooltip extends Popper {
    constructor() {
        super()

        /**
         * Injects scoped tooltip styles into the Shadow DOM.
         * @type {HTMLStyleElement}
         * @private
         */
        const _styleElement = document.createElement('style')
        _styleElement.textContent = styling
        this.shadowRoot.appendChild(_styleElement)
    }

    /**
     * Called automatically when the element is inserted into the DOM.
     * Sets up event listeners for tooltip trigger behavior.
     *
     * @returns {void}
     */
    connectedCallback() {
        super.connectedCallback?.()

        this.triggerElement?.addEventListener('mouseenter', this._openHandler)
        this.triggerElement?.addEventListener('mouseleave', this._closeHandler)
        this.triggerElement?.addEventListener('focus', this._openHandler)
        this.triggerElement?.addEventListener('blur', this._closeHandler)
    }

    /**
     * Called automatically when the element is removed from the DOM.
     * Cleans up event listeners.
     *
     * @returns {void}
     */
    disconnectedCallback() {
        super.disconnectedCallback?.()

        this.triggerElement?.removeEventListener('mouseenter', this._openHandler)
        this.triggerElement?.removeEventListener('mouseleave', this._closeHandler)
        this.triggerElement?.removeEventListener('focus', this._openHandler)
        this.triggerElement?.removeEventListener('blur', this._closeHandler)
    }

    /**
     * Shows the tooltip.
     * @private
     */
    #openHandler = () => {
        this.open = true
    }

    /**
     * Hides the tooltip.
     * @private
     */
    #closeHandler = () => {
        this.open = false
    }
}
