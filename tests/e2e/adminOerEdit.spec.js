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

test('should render OER edit page and load existing data', async ({ page }) => {
    await page.route('**/oer/42', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ id: 42, academicYear: '22/23' })
        });
    });

    await page.goto('/admin/oer/edit/42');

    await expect(page.locator('h1')).toHaveText('Nieuw oer toevoegen');
    await expect(page.locator('#create-form')).toBeVisible();

    const yearInput = page.locator('x-input#year').locator('input');
    await expect(yearInput).toHaveValue('22/23');
});

test('should send correct PUT request on form submission', async ({ page }) => {
    await page.route('**/oer/42', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ id: 42, academicYear: '22/23' })
        });
    });

    const requestPromise = page.waitForRequest(request => {
        return request.url().endsWith('/oer/42') && request.method() === 'PUT';
    });

    await page.goto('/admin/oer/edit/42');

    const yearInput = page.locator('x-input#year').locator('input');
    await yearInput.evaluate(input => input.value = '');
    await yearInput.fill('23/24');

    const submitButton = page.locator('#create-form button[type="submit"]');
    await submitButton.click();

    const request = await requestPromise;
    const postData = JSON.parse(request.postData());
    expect(postData.academicYear).toBe('23/24');
    expect(postData.id).toBe('42');
});

test('should not send request if academicYear is empty', async ({ page }) => {
    await page.route('**/oer/42', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ id: 42, academicYear: '22/23' })
        });
    });

    let requestFired = false;

    await page.route('**/oer/42', async (route, request) => {
        if (request.method() === 'PUT') {
            requestFired = true;
        }
        await route.continue();
    });

    await page.goto('/admin/oer/edit/42');

    const yearInput = page.locator('x-input#year').locator('input');
    await yearInput.evaluate(input => input.value = '');

    const submitButton = page.locator('#create-form button[type="submit"]');
    await submitButton.click();

    await page.waitForTimeout(500);
    expect(requestFired).toBe(false);
});

test('should stay on page if update fails', async ({ page }) => {
    await page.route('**/oer/42', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ id: 42, academicYear: '22/23' })
        });
    });

    await page.route('**/oer/42', async (route, request) => {
        if (request.method() === 'PUT') {
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'Internal server error' })
            });
        } else {
            await route.continue();
        }
    });

    await page.goto('/admin/oer/edit/42');

    const yearInput = page.locator('x-input#year').locator('input');
    await yearInput.evaluate(input => input.value = '');
    await yearInput.fill('23/24');

    const submitButton = page.locator('#create-form button[type="submit"]');
    await submitButton.click();

    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/\/admin\/oer\/edit\/42/);
});
