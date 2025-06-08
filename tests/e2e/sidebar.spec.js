// import { test, expect } from '@playwright/test'

// const mockUser = {
//   id: 'admin-id',
//   username: 'admin',
//   role: 'admin'
// }

// test.beforeEach(async ({ page }) => {
//   // Mock authenticatie via /auth/me
//   await page.route('**/auth/me', route =>
//     route.fulfill({
//       status: 200,
//       contentType: 'application/json',
//       body: JSON.stringify(mockUser)
//     })
//   )
// })

// test('shows sidebar when logged in', async ({ page }) => {
//   await page.goto('/admin')

//   const sidebar = page.locator('sidebar-component')
//   await expect(sidebar).toBeVisible()
// })

// test('navigates to /admin/oer when OER button is clicked', async ({ page }) => {
//   await page.goto('/admin')

//   const sidebar = page.locator('sidebar-component')
//   const button = sidebar.locator('#button-oer')

//   await expect(button).toBeVisible()
//   await button.click()

//   await expect(page).toHaveURL('/admin/oer')
// })

// test('sidebar contains expected navigation buttons', async ({ page }) => {
//   await page.goto('/admin')

//   const sidebar = page.locator('sidebar-component')

//   await expect(sidebar.locator('#button-oer')).toBeVisible()
//   await expect(sidebar.locator('#button-dashboard')).toBeVisible()
//   await expect(sidebar.locator('#button-settings')).toBeVisible()
// })

// test('sidebar renders correctly on mobile viewport', async ({ page }) => {
//   await page.setViewportSize({ width: 375, height: 667 }) // iPhone size
//   await page.goto('/admin')

//   const sidebar = page.locator('sidebar-component')
//   await expect(sidebar).toBeVisible()
// })

// test('sidebar is hidden if not admin (optional)', async ({ page }) => {
//   const nonAdminUser = { ...mockUser, role: 'student' }

//   await page.route('**/auth/me', route =>
//     route.fulfill({
//       status: 200,
//       contentType: 'application/json',
//       body: JSON.stringify(nonAdminUser)
//     })
//   )

//   await page.goto('/admin')
//   const sidebar = page.locator('sidebar-component')
//   await expect(sidebar).not.toBeVisible()
// })
