import { Dialog } from '@components'
import styling from './style.css?raw'

/**
 * <x-sheet>
 *
 * A sliding panel component that can be used as a side-drawer or modal-like interface.
 * Inherits from `Dialog` and provides control over which side the sheet appears from.
 *
 * Attributes:
 * - Inherits `open` and `disabled` from the `Dialog` component.
 * - `side`     : Specifies which side the sheet slides in from ('left', 'right', 'top', or 'bottom').
 *
 * Example usage:
 * ```html
 * <x-sheet side="right">
 *   <h2>Sheet Title</h2>
 *   <div>Sheet content here</div>
 * </x-sheet>
 * ```
 */
export class Sheet extends Dialog {
    constructor() {
        super()

        /** @type {HTMLStyleElement} */
        const _styleElement = document.createElement('style')
        _styleElement.textContent = styling
        this.shadowRoot.appendChild(_styleElement)
    }

    /**
     * Specifies the observed attributes for the component.
     * @returns {string[]} List of attributes to observe.
     */
    static get observedAttributes() {
        return [...super.observedAttributes, 'side']
    }

    /**
     * Returns the current `side` state.
     * @returns {string}
     */
    get side() {
        return this.getAttribute('side')
    }

    /**
     * Sets the current `side` state.
     * @param {string} value
     */
    set side(value) {
        this.setAttribute('side', value)
    }
}
