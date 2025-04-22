import CustomElement from '../customElement'
import sidebar from './sidebar.html?raw'
import styles from './sidebar.css?raw'
import { html } from '@/utils/functions'
import { router } from '@/http/router'

const template = html`
    <style>
        ${styles}
    </style>
    ${sidebar}
`

export class Sidebar extends CustomElement {
    constructor() {
        super()
        this.applyTemplate(template)
    }

    connectedCallback() {
        const buttons = [
            { id: 'button-modules', route: 'Admin/modules' },
            { id: 'button-oer', route: 'Admin/oer' },
            { id: 'button-categorien', route: 'Admin/categorien' },
            { id: 'button-rollen-toewijzen', route: 'Admin/rollen-toewijzen' },
            { id: 'button-slb-relaties', route: 'Admin/slb-relaties' },
        ]

        const sidebar = this.shadowRoot.getElementById('sidebar')
        const sidebarWrapper = this.shadowRoot.getElementById('sidebar-wrapper')
        console.log(sidebar, sidebarWrapper) // Debugging

        this.trackListener(sidebarWrapper, 'click', () => {
            sidebar.classList.toggle('collapsed')
        })
        buttons.forEach(button => {
            const btnElement = this.shadowRoot.getElementById(button.id)
            console.log(btnElement) // Debugging
            if (btnElement) {
                this.trackListener(btnElement, 'click', () => {
                    router.navigate(button.route)
                })
            } else {
                console.error(`Element with ID ${button.id} not found`)
            }
        })

        router.on('routeChange', newRoute => {
            buttons.forEach(button => {
                const btnElement = this.shadowRoot.getElementById(button.id)
                if (btnElement) {
                    if (newRoute === button.route) {
                        btnElement.classList.add('active')
                    } else {
                        btnElement.classList.remove('active')
                    }
                }
            })
        })
    }
}
