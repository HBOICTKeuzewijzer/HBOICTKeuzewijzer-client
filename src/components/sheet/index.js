import styling from './style.css?raw'
import { Dialog } from '@components'

/**
 * `<x-sheet>`
 *
 * A Web Component that displays a sliding panel (or sheet), functioning like a side drawer or modal.
 * Inherits behavior from the `<x-dialog>` component and adds directional control via the `side` attribute.
 *
 * ### Attributes:
 * - `open`     — Boolean (inherited): Whether the sheet is open.
 * - `disabled` — Boolean (inherited): Whether the sheet is interactive.
 * - `side`     — String: Defines which side the sheet slides in from (`'left'`, `'right'`, `'top'`, `'bottom'`).
 *
 * ### Example:
 * ```html
 * <x-sheet side="right" open>
 *   <h2>Settings</h2>
 *   <p>Panel content...</p>
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
     * Attributes to observe. Extends the parent's list by including `side`.
     * @returns {string[]}
     */
    static get observedAttributes() {
        return [...super.observedAttributes, 'side']
    }

    /**
     * Gets the value of the `side` attribute.
     * @returns {'left' | 'right' | 'top' | 'bottom'}
     */
    get side() {
        const val = this.getAttribute('side')
        return ['left', 'right', 'top', 'bottom'].includes(val) ? val : 'bottom'
    }

    /**
     * Sets the value of the `side` attribute.
     * @param {'left' | 'right' | 'top' | 'bottom'} value
     */
    set side(value = 'bottom') {
        if (['left', 'right', 'top', 'bottom'].includes(value)) {
            this.setAttribute('side', value)
        } else {
            console.warn(`<x-sheet> invalid "side" value: ${value}`)
        }
    }
}
