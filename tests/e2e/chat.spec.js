import { test, expect } from '@playwright/test'

test('loads chat and displays messages', async ({ page }) => {
  await page.goto('/chat/12345678-1234-1234-1234-123456789abc')

  // wacht tot de berichtencontainer verschijnt
  await expect(page.locator('.chat-messages')).toBeVisible()

  // je verwacht minimaal 1 bericht
  await expect(page.locator('.message5')).toHaveCountGreaterThan(0)
})

test('user can send a message', async ({ page }) => {
  await page.goto('/chat/12345678-1234-1234-1234-123456789abc')

  const input = page.locator('.input-field')
  const button = page.locator('#sendbutton')

  await input.fill('Hallo E2E 👋')
  await button.click()

  // controleer of het bericht wordt weergegeven
  await expect(page.locator('.message5')).toContainText('Hallo E2E')
})
