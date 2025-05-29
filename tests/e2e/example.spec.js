import { test, expect } from '@playwright/test'

test('homepage has title and button works', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await expect(page).toHaveTitle(/My App/)
  await page.getByText('Click me').click()
  await expect(page.getByText('Clicked!')).toBeVisible()
})
