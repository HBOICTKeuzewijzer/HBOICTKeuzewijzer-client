import CustomElement from '../customElement'
import sidebar from './sidebar.html?raw' 
import styles from './sidebar.css?raw'
import { html } from '@/utils/functions'

const template = html`
    <style>${styles}</style>
    ${sidebar}
`

export class Sidebar extends CustomElement {
    constructor() {
        super()
        this.applyTemplate(template)
    }
}
