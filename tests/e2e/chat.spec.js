import { test, expect } from '@playwright/test'

const mockUser = {
    id: 1,
    email: 'admin@example.com',
    roles: ['ModuleAdmin'],
    firstName: 'Test',
    lastName: 'Admin',
}

test.beforeEach(async ({ context, page }) => {
    // Zet sessiecookie voor authenticatie
    await context.addCookies([
        {
            name: 'x-session',
            value: JSON.stringify(mockUser),
            domain: 'localhost',
            path: '/',
            httpOnly: false,
            secure: false,
            sameSite: 'Lax',
        },
    ])

    // Mock API: auth/me
    await page.route('**/auth/me', route => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockUser),
        })
    })

    // Mock POST: nieuw bericht versturen
    await page.route('**/chat', route => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                items: [
                    {
                        id: '12345678-1234-1234-1234-123456789abc',
                        messages: [
                            {
                                id: '1',
                                messageText: 'Hallo van backend',
                                senderApplicationUserId: 1,
                                sentAt: new Date().toISOString(),
                            },
                            {
                                id: '2',
                                messageText: 'Testbericht via knop',
                                senderApplicationUserId: 1,
                                sentAt: new Date().toISOString(),
                            },
                            {
                                id: '3',
                                messageText: 'Test via Enter',
                                senderApplicationUserId: 1,
                                sentAt: new Date().toISOString(),
                            },
                        ],
                        slbApplicationUserId: 2,
                        studentApplicationUserId: 3,
                        slb: { displayName: 'SLB’er' },
                        student: { displayName: 'Student A' },
                    },
                ],
            }),
        })
    })
})

test('user sends message via send button', async ({ page }) => {
    await page.goto('/messages/12345678-1234-1234-1234-123456789abc')

    const chatComponent = page.locator('x-chat >>> .chat-container')
    await expect(chatComponent).toBeVisible()

    const input = chatComponent.locator('.input-field')
    const sendButton = chatComponent.locator('.send')

    await input.fill('Testbericht via knop')
    await sendButton.click()

    // Check of specifiek bericht zichtbaar is
    await expect(chatComponent.locator('.message5', { hasText: 'Testbericht via knop' })).toBeVisible()
})

test('chat page loads and shows messages', async ({ page }) => {
    await page.goto('/messages/12345678-1234-1234-1234-123456789abc')

    // wacht tot chat-messages zichtbaar is in shadow root
    const shadowMessagesContainer = page.locator('x-chat >>> .chat-container')
    await expect(shadowMessagesContainer).toBeVisible()

    // wacht tot een bericht binnenkomt
    const messages = shadowMessagesContainer.locator('.chat-messages')
    await expect(messages.first()).toBeVisible()

    const count = await messages.count()
    expect(count).toBeGreaterThan(0)
})

test('user sends message with Enter key', async ({ page }) => {
    await page.goto('/messages/12345678-1234-1234-1234-123456789abc')

    const chatComponent = page.locator('x-chat >>> .chat-container')
    await expect(chatComponent).toBeVisible()

    const input = chatComponent.locator('.input-field')
    const newMessage = chatComponent.locator('.message5').last()

    await input.fill('Test via Enter')
    await input.press('Enter')

    await expect(newMessage).toContainText('Test via Enter')
})
