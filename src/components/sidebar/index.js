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
            { id: 'button-modules', route: '/admin/modules' },
            { id: 'button-oer', route: '/admin/oer' },
            { id: 'button-categorien', route: '/admin/categorien' },
            { id: 'button-rollen-toewijzen', route: '/admin/rollen-toewijzen' },
            { id: 'button-slb-relaties', route: '/admin/slb-relaties' },
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
                    this.updateActiveButton(button.route)
                })
            } else {
                console.error(`Element with ID ${button.id} not found`)
            }
        })

        // Initial update of the active button
        this.updateActiveButton(window.location.pathname)

        // Listen for route changes using popstate
        window.addEventListener('popstate', () => {
            this.updateActiveButton(window.location.pathname)
        })
    }

    updateActiveButton(currentRoute) {
        const buttons = [
            { id: 'button-modules', route: '/admin/modules' },
            { id: 'button-oer', route: '/admin/oer' },
            { id: 'button-categorien', route: '/admin/categorien' },
            { id: 'button-rollen-toewijzen', route: '/admin/rollen-toewijzen' },
            { id: 'button-slb-relaties', route: '/admin/slb-relaties' },
        ]

        console.log('Route changed to:', currentRoute) // Debugging
        buttons.forEach(button => {
            const btnElement = this.shadowRoot.getElementById(button.id)
            if (btnElement) {
                console.log(`Checking button: ${button.id} for route: ${button.route}`) // Debugging
                if (currentRoute === button.route) {
                    console.log(`Activating button: ${button.id}`) // Debugging
                    btnElement.classList.add('active')
                } else {
                    btnElement.classList.remove('active')
                }
            }
        })
    }
}
