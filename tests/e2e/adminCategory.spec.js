import { test, expect } from '@playwright/test';

const mockUser = {
    id: 1,
    email: 'admin@example.com',
    roles: ['ModuleAdmin'],
    firstName: 'Test',
    lastName: 'Admin'
};

test.beforeEach(async ({ context, page }) => {
    // Set fake session cookie so auth middleware passes
    await context.addCookies([{
        name: 'x-session',
        value: JSON.stringify(mockUser),
        domain: 'localhost',
        path: '/',
        httpOnly: false,
        secure: false,
        sameSite: 'Lax'
    }]);

    // Global interception of the API request for initial datatable load
    await page.route('**/category/paginated**', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                items: [
                    { id: 1, value: 'Category A', accentColor: '#FF0000', primaryColor: '#00FF00', position: 1 },
                    { id: 2, value: 'Category B', accentColor: '#0000FF', primaryColor: '#FFFF00', position: 2 }
                ],
                totalCount: 2
            })
        });
    });
});

test('Should render category page when logged in as ModuleAdmin', async ({ page }) => {
    await page.goto('/admin/categorien');
    await expect(page.locator('h1')).toHaveText('Categorieën beheren');
    await expect(page.locator('#add-button')).toBeVisible();
});

test('should display categories in datatable', async ({ page }) => {
    await page.goto('/admin/categorien');

    const firstRow = page.locator('tbody tr').nth(0);
    await expect(firstRow).toContainText('Category A');
    await expect(firstRow).toContainText('#FF0000');
    await expect(firstRow).toContainText('#00FF00');

    const secondRow = page.locator('tbody tr').nth(1);
    await expect(secondRow).toContainText('Category B');
});

test('should send correct query params (sorting)', async ({ page, context }) => {
    await page.unroute('**/category/paginated**');

    await page.route('**/category/paginated**', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ items: [], totalCount: 0 })
        });
    });

    await page.goto('/admin/categorien');

    const ascButton = page.locator('[data-path="value"][data-direction="asc"]');

    const requestPromise = page.waitForRequest(request => {
        const url = new URL(request.url());
        return url.pathname.includes('/category/paginated') &&
            url.searchParams.get('sortColumn') === 'value' &&
            url.searchParams.get('sortDirection') === 'asc' &&
            url.searchParams.get('page') === '1' &&
            url.searchParams.get('pageSize') === '10';
    });

    await ascButton.click();

    const request = await requestPromise;

    const url = new URL(request.url());

    expect(url.searchParams.get('sortColumn')).toBe('value');
    expect(url.searchParams.get('sortDirection')).toBe('asc');
    expect(url.searchParams.get('page')).toBe('1');
    expect(url.searchParams.get('pageSize')).toBe('10');
});

test('should send correct query params (search)', async ({ page, context }) => {
    await page.unroute('**/category/paginated**');

    await page.route('**/category/paginated**', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ items: [], totalCount: 0 })
        });
    });

    await page.goto('/admin/categorien');

    const input = page.locator('x-input').locator('input');
    await input.fill('TestSearch');

    const requestPromise = page.waitForRequest(request => {
        const url = new URL(request.url());
        return url.pathname.includes('/category/paginated') &&
            url.searchParams.get('filter') === 'TestSearch';
    });

    const request = await requestPromise;

    const url = new URL(request.url());

    expect(url.searchParams.get('filter')).toBe('TestSearch');
});

test('should open delete dialog and send DELETE request on confirm', async ({ page, context }) => {
    await page.unroute('**/category/paginated**');

    await page.route('**/category/paginated**', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                items: [
                    { id: 42, value: 'Category A', accentColor: '#FF0000', primaryColor: '#00FF00', position: 1 }
                ],
                totalCount: 1
            })
        });
    });

    const deleteRequestPromise = page.waitForRequest(request => {
        return request.url().endsWith('/category/42') && request.method() === 'DELETE';
    });

    await page.goto('/admin/categorien');

    const deleteButton = page.locator('tbody tr').nth(0).locator('button[data-action="delete"]');
    await deleteButton.click();

    const dialog = page.locator('#confirmDeleteDialog');
    await expect(dialog).toHaveAttribute('open', '');

    const confirmYes = page.locator('x-dialog#confirmDeleteDialog').locator('#confirmYes');
    await confirmYes.click();

    await deleteRequestPromise;
});

test('should navigate to edit page when clicking edit button', async ({ page, context }) => {
    await page.unroute('**/category/paginated**');

    await page.route('**/category/paginated**', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                items: [
                    { id: 42, value: 'Category A', accentColor: '#FF0000', primaryColor: '#00FF00', position: 1 }
                ],
                totalCount: 1
            })
        });
    });

    await page.goto('/admin/categorien');

    const editButton = page.locator('tbody tr').nth(0).locator('button[data-action="edit"]');
    await editButton.click();

    await expect(page).toHaveURL(/\/admin\/categorien\/edit\/42$/);
});

test('should navigate to create page when clicking add button', async ({ page, context }) => {
    await page.unroute('**/category/paginated**');

    await page.route('**/category/paginated**', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                items: [
                    { id: 42, value: 'Category A', accentColor: '#FF0000', primaryColor: '#00FF00', position: 1 }
                ],
                totalCount: 1
            })
        });
    });

    await page.goto('/admin/categorien');

    const addButton = page.locator('#add-button');
    await addButton.click();

    await expect(page).toHaveURL('/admin/categorien/create');
});
