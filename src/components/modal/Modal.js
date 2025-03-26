import { BaseElement } from '../BaseElement'
import template from './template.html?raw'

class Modal extends BaseElement {
    constructor() {
        super(template)
    }

    
}
customElements.define('x-modal', Modal)
