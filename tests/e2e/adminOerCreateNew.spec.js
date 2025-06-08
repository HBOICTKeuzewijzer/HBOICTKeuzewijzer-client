import { test, expect } from '@playwright/test';

const mockUser = {
    id: 1,
    email: 'admin@example.com',
    roles: ['ModuleAdmin'],
    firstName: 'Test',
    lastName: 'Admin'
};

test.beforeEach(async ({ context }) => {
    await context.addCookies([{
        name: 'x-session',
        value: JSON.stringify(mockUser),
        domain: 'localhost',
        path: '/',
        httpOnly: false,
        secure: false,
        sameSite: 'Lax'
    }]);
});

test('should render OER create page', async ({ page }) => {
    await page.goto('/admin/oer/create');
    await expect(page.locator('h1')).toHaveText('Nieuw oer toevoegen');
    await expect(page.locator('#create-form')).toBeVisible();
});

test('should send correct POST request on form submission', async ({ page }) => {
    const requestPromise = page.waitForRequest(request => {
        return request.url().endsWith('/oer') && request.method() === 'POST';
    });

    await page.goto('/admin/oer/create');

    const yearInput = page.locator('x-input#year').locator('input');
    await yearInput.fill('22/23');

    const submitButton = page.locator('#create-form button[type="submit"]');
    await submitButton.click();

    const request = await requestPromise;
    const postData = JSON.parse(request.postData());
    expect(postData.academicYear).toBe('22/23');
});

test('should not send request if academicYear is empty', async ({ page }) => {
    let requestFired = false;

    await page.route('**/oer', async route => {
        requestFired = true;
        await route.continue();
    });

    await page.goto('/admin/oer/create');

    const submitButton = page.locator('#create-form button[type="submit"]');
    await submitButton.click();

    await page.waitForTimeout(500);
    expect(requestFired).toBe(false);
});

test('should stay on page if creation fails', async ({ page }) => {
    await page.route('**/oer', async route => {
        await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Internal server error' })
        });
    });

    await page.goto('/admin/oer/create');

    const yearInput = page.locator('x-input#year').locator('input');
    await yearInput.fill('22/23');

    const submitButton = page.locator('#create-form button[type="submit"]');
    await submitButton.click();

    await page.waitForTimeout(500);

    await expect(page).toHaveURL('/admin/oer/create');
});
