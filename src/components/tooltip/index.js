import { Popper } from '@components'
import styling from './style.css?raw'

/**
 * Tooltip Web Component
 *
 * A custom HTML element that displays a contextual tooltip when hovering over a trigger element.
 * It extends the `Popper` component for positioning and alignment functionality.
 *
 * The tooltip content is shown and hidden on mouseover and mouseout events, respectively.
 * Styles are encapsulated via Shadow DOM using the provided CSS module.
 *
 * Attributes:
 * - Inherits attributes from `Popper`, such as `placement` and `offset`.
 *
 * Slots:
 * - `trigger`  : Interactive element that triggers the tooltip on hover.
 * - default    : Content of the tooltip.
 *
 * Example:
 * ```html
 * <custom-tooltip>
 *   <button slot="trigger">Hover me</button>
 *   <span>Tooltip content</span>
 * </custom-tooltip>
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
