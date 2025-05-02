import CustomElement from "../customElement"
import chat from './chat.html?raw'
import styles from './chat.css?raw'
import { html } from '@/utils/functions'

const template = html`
    <style>
        ${styles}
    </style>
    ${chat}
`

export class Chat extends CustomElement {
    constructor() {
        super()
        this.applyTemplate(template)
    }


}