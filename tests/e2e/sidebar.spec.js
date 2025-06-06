import { test, expect } from '@playwright/test'

test('navigates to /admin/oer when clicking OER button', async ({ page }) => {
  await page.goto('/admin/modules')

  // Zorg dat de knop zichtbaar is
  await expect(page.locator('#button-oer')).toBeVisible()

  await page.locator('#button-oer').click()

  await expect(page).toHaveURL('/admin/oer')
})
