// import { test, expect } from '@playwright/test'

// const mobile = { width: 375, height: 812 }
// const desktop = { width: 1280, height: 800 }

// test.describe('[Planner/Guest] - General Tests', () => {
//     test('Should not render less than 4 study cards.', async ({ page }) => {
//         await page.goto('/guest')

//         // Ensure the container for the study cards is present
//         const container = await page.locator('#study-cards-container')
//         await expect(container).toBeVisible()

//         // Get all the study-card components that are visible in the DOM
//         const studyCards = container.locator('x-study-card')
//         const count = await studyCards.count()

//         expect(count).toBeGreaterThanOrEqual(4)
//     })

//     test('Each study card should have a unique year', async ({ page }) => {
//         await page.goto('/guest')

//         const cards = page.locator('#study-cards-container x-study-card')
//         const count = await cards.count()

//         for (let i = 0; i < count; i++) {
//             const title = cards.nth(i).locator('[data-testid="study-card-year"]')

//             await expect(title).toBeVisible()
//             expect(title).toHaveText(`Jaar ${i + 1}`)
//         }
//     })
// })

// test.describe('[Planner/Guest] - Accesability', () => {
//     test('Study card container should be scrollable if overflowing', async ({ page }) => {
//         await page.goto('/guest')
//         const container = page.locator('#study-cards-container')
//         const overflow = await container.evaluate((el) => {
//             return el.scrollHeight > el.clientHeight
//         })
//         expect(overflow).toBe(true)
//     })
// })

// test.describe('[Planner/Guest] - Desktop Tests', () => {
//     test.use({ viewport: desktop })

//     test('Should hide module drawer on desktop', async ({ page }) => {
//         await page.goto('/guest')

//         const drawer = page.getByTestId('module-drawer')
//         await expect(drawer).toBeHidden()
//     })

//     test('Should show module sheet on desktop', async ({ page }) => {
//         await page.goto('/guest')

//         const sheet = page.getByTestId('module-sheet')
//         await expect(sheet).toBeVisible()
//     })
// })

// test.describe('[Planner/Guest] - Mobile Tests', () => {
//     test.use({ viewport: mobile })

//     test('Should not show module sheet', async ({ page }) => {
//         await page.goto('/guest')

//         const sheet = page.getByTestId('module-sheet')
//         await expect(sheet).toBeHidden()
//     })

//     test('Drawer should not be open by default', async ({ page }) => {
//         await page.goto('/guest')

//         const drawer = page.getByTestId('module-drawer')
//         const openAttribute = await drawer.getAttribute('open')

//         expect(openAttribute).toBeNull()
//     })

//     test('Should close drawer with handle', async ({ page }) => {
//         await page.goto('/guest')

//         const drawer = page.getByTestId('module-drawer')
//         const drawerHandle = drawer.locator('[data-handle]')

//         await drawer.evaluate((el) => el.setAttribute('open', ''))
//         await drawerHandle.click()

//         const openAttribute = await drawer.getAttribute('open')

//         expect(openAttribute).not.toBeNull()
//     })

//     test('Should open drawer when selecting a study card option', async ({ page }) => {
//         await page.goto('/guest')

//         const cards = page.locator('#study-cards-container x-study-card')
//         const cardModuleOption = cards.first().locator('[data-card-module]').first()

//         await cardModuleOption.click()

//         const drawer = page.getByTestId('module-drawer')
//         const openAttribute = await drawer.getAttribute('open')

//         expect(openAttribute).not.toBeNull()
//     })
// })