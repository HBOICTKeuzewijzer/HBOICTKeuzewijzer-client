import { vi, describe, it, expect, beforeEach } from 'vitest'
import { Sidebar } from '@/components/sidebar'
import { router } from '@/http/router'

beforeEach(() => {
    localStorage.clear()
})

vi.mock('@/http/router', () => ({
    router: { navigate: vi.fn() },
}))

if (!customElements.get('sidebar-component')) {
    customElements.define('sidebar-component', Sidebar)
}

describe('Sidebar - toggling collapsed state', () => {
    it('toggles collapsed class and saves state in localStorage', () => {
        const el = new Sidebar()
        document.body.appendChild(el)

        const shadow = el.shadowRoot
        const sidebar = shadow.getElementById('sidebar')
        const wrapper = shadow.getElementById('sidebar-wrapper')

        expect(sidebar.classList.contains('collapsed')).toBe(false)

        wrapper.click()

        expect(sidebar.classList.contains('collapsed')).toBe(true)

        expect(localStorage.getItem('sidebarState')).toBe('collapsed')

        wrapper.click()
        expect(sidebar.classList.contains('collapsed')).toBe(false)
        expect(localStorage.getItem('sidebarState')).toBe('expanded')
    })
})

describe('Sidebar button navigation', () => {
    beforeEach(() => {
        // reset mocks & dom
        vi.clearAllMocks()
        document.body.innerHTML = ''
    })

    const buttons = [
        { id: 'button-modules', route: '/admin/modules' },
        { id: 'button-oer', route: '/admin/oer' },
        { id: 'button-categorien', route: '/admin/categorien' },
    ]

    buttons.forEach(({ id, route }) => {
        it(`navigates to "${route}" when "${id}" is clicked`, () => {
            const el = new Sidebar()
            document.body.appendChild(el)

            const shadow = el.shadowRoot
            const btn = shadow.getElementById(id)

            expect(btn).toBeTruthy()

            btn.click()

            expect(router.navigate).toHaveBeenCalledWith(route)
        })
    })
})

describe('Sidebar active button logic', () => {
    beforeEach(() => {
        document.body.innerHTML = ''
    })

    it('should add "active" class to button that matches window.location.pathname', () => {
        // 👇 Simuleer route
        window.history.pushState({}, '', '/admin/oer')

        // Maak component aan
        const el = new Sidebar()
        document.body.appendChild(el)

        const shadow = el.shadowRoot

        // Pak de knoppen
        const oerBtn = shadow.getElementById('button-oer')
        const modulesBtn = shadow.getElementById('button-modules')
        const catBtn = shadow.getElementById('button-categorien')

        // ✅ Check
        expect(oerBtn.classList.contains('active')).toBe(true)
        expect(modulesBtn.classList.contains('active')).toBe(false)
        expect(catBtn.classList.contains('active')).toBe(false)
    })
})
