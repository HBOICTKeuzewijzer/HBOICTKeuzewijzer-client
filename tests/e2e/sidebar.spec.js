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

    // Mock API: /auth/me
    await page.route('**/auth/me', route =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockUser),
        }),
    )
})

// test('shows sidebar when logged in', async ({ page }) => {
//     await page.goto('/admin')

//     const sidebar = page.locator('x-sidebar')
//     await expect(sidebar).toBeVisible()
// })

// test('navigates to /admin/oer when OER button is clicked', async ({ page }) => {
//     await page.goto('/admin')

//     // Wacht tot de sidebar zichtbaar is
//     await expect(page.locator('x-sidebar')).toBeVisible()

//     // Gebruik de correcte shadow DOM syntax
//     const button = page.locator('div.button#button-oer')
//     await expect(button).toBeVisible()
//     await button.click()

//     // Controleer de URL
//     const path = await page.evaluate(() => window.location.pathname)
//     expect(path).toBe('/admin/oer')
// })

// test('sidebar contains expected navigation buttons', async ({ page }) => {
//     await page.goto('/admin')

//     const sidebar = page.locator('#sidebar')

//     await expect(sidebar.locator('div.button#button-modules')).toBeVisible()
//     await expect(sidebar.locator('div.button#button-oer')).toBeVisible()
//     await expect(sidebar.locator('div.button#button-categorien')).toBeVisible()
// })

// test('sidebar becomes visible after mobile toggle is clicked', async ({ page }) => {
//   await page.setViewportSize({ width: 375, height: 667 }) // iPhone size
//   await page.goto('/admin')

//   const toggleButton = page.locator('#mob-toggle')
//   await expect(toggleButton).toBeVisible()
//   await toggleButton.click({ force: true })

//   const headerRoutes = page.locator('.header-routes')
//   await expect(headerRoutes).toHaveClass(/open/)
// })

// test('active class is added to the correct button when navigating', async ({ page }) => {
//   await page.goto('/admin/oer')

//   const sidebar = page.locator('x-sidebar')
//   const oerButton = sidebar.locator('div.button#button-oer')

//   await expect(oerButton).toHaveClass(/active/)
// })

test('sidebar toggles collapsed state on click', async ({ page }) => {
  await page.goto('/admin')

  // Zorg dat shadow component klaar is
  await expect(page.locator('x-sidebar')).toBeVisible()

  const wrapper = page.locator('x-sidebar >>> #sidebar-wrapper')
  const sidebar = page.locator('x-sidebar >>> #sidebar')

  await expect(wrapper).toBeVisible()

  // Eerste klik → collapse
  await wrapper.click()
  await expect(sidebar).toHaveClass(/collapsed/)

  // Tweede klik → expand
  await wrapper.click()
  await expect(sidebar).not.toHaveClass(/collapsed/)
})
