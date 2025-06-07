import { test, expect } from '@playwright/test'

test.describe('ChatSidebar E2E', () => {
    test.beforeEach(async ({ page }) => {
        // Stel een mockpagina in die de ChatSidebar bevat
        await page.setContent(`
            <html>
                <body>
                    <chat-sidebar></chat-sidebar>
                    <script type="module">
                        import { ChatSidebar } from '/src/components/chatSidebar/index.js';
                        if (!customElements.get('chat-sidebar')) {
                            customElements.define('chat-sidebar', ChatSidebar);
                        }
                    </script>
                </body>
            </html>
        `)
    })

    test('sidebar should render and search should filter chats', async ({ page }) => {
        // Wacht tot de sidebar geladen is
        await page.waitForSelector('chat-sidebar')
        const shadow = await page.locator('chat-sidebar').evaluateHandle(el => el.shadowRoot)

        // Voeg handmatig chats toe aan de chat-list in de shadow DOM
        await page.evaluate(shadow => {
            const chatList = shadow.getElementById('chat-list')
            chatList.innerHTML = `
                <div class="chat-item"><span class="student-name">Alice</span><span class="student-id">a1</span></div>
                <div class="chat-item"><span class="student-name">Bob</span><span class="student-id">b2</span></div>
            `
        }, shadow)

        // Zoek op "Alice"
        const searchBar = await shadow.evaluateHandle(shadow => shadow.getElementById('search-bar'))
        await searchBar.type('Alice')

        // Controleer dat alleen Alice zichtbaar is
        const visibleChats = await shadow.evaluate(shadow => {
            return Array.from(shadow.querySelectorAll('.chat-item'))
                .filter(item => item.style.display !== 'none')
                .map(item => item.querySelector('.student-name').textContent)
        })
        expect(visibleChats).toEqual(['Alice'])
    })

    test('should open new chat dialog and validate email', async ({ page }) => {
        const shadow = await page.locator('chat-sidebar').evaluateHandle(el => el.shadowRoot)
        const newChatBtn = await shadow.evaluateHandle(shadow => shadow.getElementById('new-chat-btn'))
        await newChatBtn.click()

        // Vul een ongeldig e-mailadres in
        const input = await shadow.evaluateHandle(shadow => shadow.getElementById('newChatEmail'))
        await input.type('foutemail')
        const confirmBtn = await shadow.evaluateHandle(shadow => shadow.getElementById('newChatConfirmYes'))
        await confirmBtn.click()

        // Controleer op foutmelding
        const error = await shadow.evaluate(shadow => shadow.getElementById('newChatEmail').error)
        expect(error).toContain('geldig e-mailadres')
    })
})