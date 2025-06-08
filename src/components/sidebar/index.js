import CustomElement from '../customElement'
import sidebar from './sidebar.html?raw'
import styles from './sidebar.css?raw'
import { html } from '@/utils/functions'
import { router } from '@/http/router'

// Combineer HTML- en CSS-inhoud tot een shadow DOM-template
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
        // de gekoppelde routes en bijbehorende id's
        const buttons = [
            { id: 'button-modules', route: '/admin/modules' },
            { id: 'button-oer', route: '/admin/oer' },
            { id: 'button-categorien', route: '/admin/categorien' },
        ]

        const sidebar = this.shadowRoot.getElementById('sidebar')
        const sidebarWrapper = this.shadowRoot.getElementById('sidebar-wrapper')

        // Herstel vorige staat van de sidebar uit localStorage
        if (localStorage.getItem('sidebarState') === 'collapsed') {
            sidebar.classList.add('collapsed')
        }

        this.trackListener(sidebarWrapper, 'click', e => {
            e.stopPropagation()
            sidebar.classList.toggle('collapsed')
            localStorage.setItem('sidebarState', sidebar.classList.contains('collapsed') ? 'collapsed' : 'expanded')
        })

        // Koppel klikgedrag aan knoppen en navigeer via router
        buttons.forEach(button => {
            const btnElement = this.shadowRoot.getElementById(button.id)
            if (btnElement) {
                this.trackListener(btnElement, 'click', () => {
                    router.navigate(button.route)
                    this.updateActiveButton(button.route)
                })
            } else {
                console.error(`Element with ID ${button.id} not found`)
            }
        })

        // Highlight juiste knop op basis van huidige route
        this.updateActiveButton(window.location.pathname)

        // hier wordt de actieve knop aangepast bij navigatie via browsergeschiedenis
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
        ]

        buttons.forEach(button => {
            const btnElement = this.shadowRoot.getElementById(button.id)
            if (btnElement) {
                if (currentRoute === button.route) {
                    btnElement.classList.add('active')
                } else {
                    btnElement.classList.remove('active')
                }
            }
        })
    }
}
