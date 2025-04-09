import template from './template.html?raw'
import styling from './style.css?raw'

/**
 * Creates a template for the Sheet component, including styles and HTML structure.
 */
const _template = document.createElement('template')
_template.innerHTML = `
    <style>${styling}</style>
    ${template}
`

export class Popper extends HTMLElement {
     /**
     * Specifies the observed attributes for the component.
     * @returns {string[]} List of attributes to observe.
     */
     static get observedAttributes() {
        return ['open', 'side']
    }

    constructor() {
        super()

        this.attachShadow({ mode: 'open' })
        this.shadowRoot.appendChild(_template.content.cloneNode(true))
    }

    /**
     * Returns the current open state.
     * @returns {boolean}
     */
    get open() {
        return this.hasAttribute('open')
    }

    /**
     * Sets the current open state.
     * @param {boolean}
     * @returns {this}
     */
    set open(state) {
        console.log('[Popper] open setter called with:', state)
        this.toggleAttribute('open', state)
    }
}