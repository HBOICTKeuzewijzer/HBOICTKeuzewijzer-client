import template from './template.html?raw'
import styling from './style.css?raw'

// Create and attach the component's shadow DOM template
const _template = document.createElement('template')
_template.innerHTML = `
    <style>${styling}</style>
    ${template}
`

export class PageHeader extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' }).appendChild(_template.content.cloneNode(true))
    }
}
