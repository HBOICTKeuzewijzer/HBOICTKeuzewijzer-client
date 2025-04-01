import template from './template.html?raw'
import styling from './style.css?raw'

export class Sheet extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })

        this.open = true;

        const tmpl = document.createElement('template')
        tmpl.innerHTML = template

        var docFragment = document.importNode(tmpl.content, true)
        this.fragment = docFragment

        const style = document.createElement("style");
        style.textContent = styling
        this.fragment.appendChild(style)
    }

    static get observedAttributes() {
        return ['open', 'type']
    }

    /**
     * Returns the current open state.
     * @returns {boolean}
    */
    get open() { return this.hasAttribute('open') }

    /**
     * Change the current open state.
     * @param {boolean} value
     * @returns {this}
    */
    set open(value) {
        value
            ? this.setAttribute('open', value)
            : this.removeAttribute('open')
    }

    /**
     * Opens the drawer by setting the `open` state.
     * @returns {void}
     */
    show() { this.open = true }

    /**
     * Closes the drawer by setting the `open` state.
     * @returns {void}
     */
    hide() { this.open = false }

    connectedCallback() {
        if (!this.shadowRoot.hasChildNodes()) {
            this.shadowRoot.appendChild(this.fragment)

            this.shadowRoot.host.style = `width: ${this.fragment.clientWidth}px;`
        }

        this.setAttribute('open', this.open)
    }

    disconnectedCallback() {
        console.log('Custom element removed from page.')
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} has changed from ${oldValue} to ${newValue}.`)
        this.shadowRoot.firstChild.setAttribute(name, newValue)

        console.log(this.shadowRoot.firstChild.offsetWidth)

        if (name == 'open') {
            var style = this.shadowRoot.firstChild.currentStyle || window.getComputedStyle(this.shadowRoot.firstChild),
            width = this.shadowRoot.firstChild.offsetWidth, // or use style.width
            margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight),
            padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight),
            border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);

            this.shadowRoot.host.style = `display: flex; width: ${width + padding + margin + border}px`
        } 
    }
}
