export class BaseElement extends HTMLElement {
    fragment

    constructor(template) {
        super()

        this.attachShadow({ mode: 'open' })

        const tmpl = document.createElement('template')
        tmpl.innerHTML = template

        var docFragment = document.importNode(tmpl.content, true)
        docFragment.firstChild.id = this.getAttribute('id')

        this.fragment = docFragment
    }

    connectedCallback() {
        if (!this.shadowRoot.hasChildNodes()) {
            this.shadowRoot.appendChild(this.fragment)
        }
    }
}
