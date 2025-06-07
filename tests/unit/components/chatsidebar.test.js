import { ChatSidebar } from '@/components/chatSidebar'
import { vi, describe, it, expect, beforeEach } from 'vitest'

if (!window.matchMedia) {
    window.matchMedia = () => ({
        matches: false,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        onchange: null,
        dispatchEvent: () => false,
    })
}
describe('ChatSidebar', () => {
    let sidebar

    beforeEach(() => {
        // Mock fetcher and router globally
        global.fetcher = vi.fn(() => Promise.resolve({ items: [], id: 'me' }))
        global.router = { navigate: vi.fn() }
        // Register custom element if not already
        if (!customElements.get('chat-sidebar')) {
            customElements.define('chat-sidebar', ChatSidebar)
        }
        sidebar = new ChatSidebar()
        document.body.appendChild(sidebar)
    })

    it('should attach shadow DOM and render sidebar', () => {
        expect(sidebar.shadowRoot).toBeDefined()
        expect(sidebar.shadowRoot.innerHTML).toContain('Zoek op naam of studentnummer')
        expect(sidebar.shadowRoot.getElementById('chat-sidebar')).toBeTruthy()
    })

    it('should validate email correctly', () => {
        expect(sidebar.validateEmail('test@example.com')).toBe(true)
        expect(sidebar.validateEmail('invalid-email')).toBe(false)
    })

    it('should filter chat list', () => {
        // Setup: Add two chat items
        const chatList = sidebar.shadowRoot.getElementById('chat-list')
        chatList.innerHTML = `
            <div class="chat-item"><span class="student-name">Alice</span><span class="student-id">a1</span></div>
            <div class="chat-item"><span class="student-name">Bob</span><span class="student-id">b2</span></div>
        `
        sidebar.filterChatList('alice')
        const items = sidebar.shadowRoot.querySelectorAll('.chat-item')
        expect(items[0].style.display).toBe('flex')
        expect(items[1].style.display).toBe('none')
    })

    it('should remove unread indicator if present', () => {
        const chatList = sidebar.shadowRoot.getElementById('chat-list')
        chatList.innerHTML = `
            <div class="chat-item" data-chat-id="c1">
                <span class="unread-indicator"></span>
            </div>
        `
        sidebar.removeUnreadIndicator('c1')
        const indicator = sidebar.shadowRoot.querySelector('.unread-indicator')
        expect(indicator).toBeNull()
    })
})