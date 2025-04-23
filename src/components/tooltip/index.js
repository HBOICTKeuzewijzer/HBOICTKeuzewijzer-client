import { Popper } from '@components'
import styling from './style.css?raw'

/**
 * <x-tooltip>
 *
 * A lightweight tooltip component that appears on hover or focus.
 * Inherits positioning from Popper and includes accessibility improvements.
 *
 * Attributes:
 * - `position`: String - tooltip placement ('top' | 'right' | 'bottom' | 'left')
 * - `delay`   : Number - show/hide delay in milliseconds (default: 0)
 *
 * Slots:
 * - `trigger` : Element that triggers the tooltip (hover/focus)
 * - *default* : Tooltip content element annotated with `data-content`
 *
 * Example:
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

        this.triggerElement?.addEventListener('mouseenter', this.#openHandler)
        this.triggerElement?.addEventListener('mouseleave', this.#closeHandler)
        this.triggerElement?.addEventListener('focus', this.#openHandler)
        this.triggerElement?.addEventListener('blur', this.#closeHandler)
    }

    /**
     * Lifecycle method triggered when the component is removed from the DOM.
     */
    disconnectedCallback() {
        super.disconnectedCallback()

        this.triggerElement?.removeEventListener('mouseenter', this.#openHandler)
        this.triggerElement?.removeEventListener('mouseleave', this.#closeHandler)
        this.triggerElement?.removeEventListener('focus', this.#openHandler)
        this.triggerElement?.removeEventListener('blur', this.#closeHandler)
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
