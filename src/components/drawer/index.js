import template from './template.html?raw'
import styling from './style.css?raw'

/**
 * Creates a template for the Dialog component, including styles and HTML structure.
 */
const _template = document.createElement('template')
_template.innerHTML = `
    <style>${styling}</style>
    ${template}
`

/**
 * Dialog Web Component
 *
 * A base component for modal-like interfaces that can be shown/hidden.
 * Provides core functionality for managing visibility and accessibility.
 *
 * Attributes:
 * - `open`: Controls visibility of the dialog
 * - `disabled`: Disables interaction with the dialog
 *
 * Properties:
 * - `open`: Boolean getter/setter for visibility
 * - `disabled`: Boolean getter/setter for disabled state
 *
 * Example:
 * ```html
 * <x-dialog>
 *   <div>Dialog content here</div>
 * </x-dialog>
 * ```
 */
export class Drawer extends HTMLElement {
    /** @type {HTMLElement | null} */
    triggerElement = null
    /** @type {HTMLElement | null} */
    contentElement = null
    /** @type {HTMLElement | null} */
    backdropElement = null

    constructor() {
        super()

        this.attachShadow({ mode: 'open' }).appendChild(_template.content.cloneNode(true))
    }

    /**
     * Specifies the observed attributes for the component.
     * @returns {string[]} List of attributes to observe.
     */
    static get observedAttributes() {
        return ['open', 'disabled']
    }
}
