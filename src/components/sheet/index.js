import { Dialog } from '@components'
import styling from './style.css?raw'

/**
 * Sheet Web Component
 *
 * A custom element that represents a sheet (such as a modal or a side drawer),
 * which can be toggled open or closed via the `open` attribute.
 */
export class Sheet extends Dialog {
    constructor() {
        super()

        /** @type {HTMLStyleElement} */
        const _styleElement = document.createElement('style')
        _styleElement.textContent = styling
        this.shadowRoot.appendChild(_styleElement)
    }

    //TODO: add side attribute to specify if the sheet is left or right of the screen.
}
