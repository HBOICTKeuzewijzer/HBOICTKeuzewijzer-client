// import { test, expect } from '@playwright/test'

// const mockUser = {
//     id: 1,
//     email: 'admin@example.com',
//     roles: ['ModuleAdmin'],
//     firstName: 'Test',
//     lastName: 'Admin',
// }

// test.beforeEach(async ({ context, page }) => {
//     // Zet sessiecookie voor authenticatie
//     await context.addCookies([
//         {
//             name: 'x-session',
//             value: JSON.stringify(mockUser),
//             domain: 'localhost',
//             path: '/',
//             httpOnly: false,
//             secure: false,
//             sameSite: 'Lax',
//         },
//     ])

//     // Mock API: auth/me
//     await page.route('**/auth/me', route => {
//         route.fulfill({
//             status: 200,
//             contentType: 'application/json',
//             body: JSON.stringify(mockUser),
//         })
//     })

//     // Mock API: messages (lijst met 1 chat en 1 bericht)
//     await page.route('**/messages', route => {
//         route.fulfill({
//             status: 200,
//             contentType: 'application/json',
//             body: JSON.stringify({
//                 items: [
//                     {
//                         id: '12345678-1234-1234-1234-123456789abc',
//                         messages: [
//                             {
//                                 id: '1',
//                                 messageText: 'Hallo van backend',
//                                 senderApplicationUserId: 1,
//                                 sentAt: new Date().toISOString(),
//                             },
//                         ],
//                         slbApplicationUserId: 2,
//                         studentApplicationUserId: 3,
//                         slb: { displayName: 'SLB’er' },
//                         student: { displayName: 'Student A' },
//                     },
//                 ],
//             }),
//         })
//     })

//     // Mock POST: nieuw bericht versturen
//     await page.route('**/messages/**/message', route => {
//         route.fulfill({ status: 200 })
//     })
// })

// test('chat page loads and shows messages', async ({ page }) => {
//     await page.goto('/messages/12345678-1234-1234-1234-123456789abc')

//     // wacht tot chat-component zichtbaar is
//     await page.waitForSelector('chat-component', { timeout: 5000 })

//     const chatComponent = page.locator('chat-component')

//     // wacht tot chat-messages zichtbaar is in shadow root
//     const shadowMessagesContainer = chatComponent.locator('shadow=.chat-messages')
//     await expect(shadowMessagesContainer).toBeVisible()

//     // wacht tot een bericht binnenkomt
//     const messages = chatComponent.locator('shadow=.message5')
//     await expect(messages.first()).toBeVisible()

//     const count = await messages.count()
//     expect(count).toBeGreaterThan(0)
// })


