import { Dialog } from '@components'
import styling from './style.css?raw'

/**
 * Sheet Web Component
 *
 * A sliding panel component that appears from the edge of the screen.
 * Extends Dialog to provide a side-drawer or modal-like interface.
 *
 * Attributes:
 * - Inherits `open` and `disabled` from Dialog
 * - `side`: Controls which side the sheet appears from ('left'|'right'|'top'|'bottom')
 *
 * Example:
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
