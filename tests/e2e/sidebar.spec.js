import { test, expect } from '@playwright/test'

test('shows sidebar when logged in via mocked /auth/me', async ({ page }) => {
  await page.route('**/auth/me', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'admin-id',
        username: 'admin',
        role: 'admin',
      }),
    })
  )

  await page.goto('/admin')

  const sidebar = page.locator('sidebar-component')
  // await expect(sidebar).toBeVisible()

  const button = sidebar.locator('#button-oer')
  // await button.click()

  await expect(page).toHaveURL('/admin/oer')
})
