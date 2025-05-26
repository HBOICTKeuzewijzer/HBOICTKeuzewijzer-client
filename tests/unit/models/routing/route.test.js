import { describe, it, expect } from 'vitest'
import { Route } from '@models'

/**
 * Route model tests
 * ------------------------------------
 * This suite validates the functionality of the `Route` model by testing:
 * - Route creation with various argument types (with and without middleware),
 * - Conversion of single middleware into an array,
 * - URL matching with static, dynamic, and query-based segments,
 * - Rejection of malformed or unmatched paths.
 *
 * Covered test scenarios:
 * - [Should] Create a route with path, component, and an array of middleware,
 * - [Should] Create a route without any middleware,
 * - [Should] Convert non-array middleware into an array,
 * - [Should] Match dynamic segments in the URL (e.g., `/profile/:userId`),
 * - [Should] Parse query strings (e.g., `/search/posts?limit=10`),
 * - [Should] Match combined dynamic segments and query strings,
 * - [Should] Return `null` for non-matching or malformed paths:
 *   - Incorrect base paths,
 *   - Extra segments,
 *   - Missing dynamic parameters,
 *   - Malformed query strings.
 */
describe('[Models] Route', () => {
    /** @type {Function} */
    const pageMock = import('@pages/page')
    /** @type {Function} */
    const middlewareMock = () => {}
    /** @type {Function} */
    const secondMiddlewareMock = () => {}

    it('[Should] Create a route with path, component, and middleware array', () => {
        const route = new Route('/planner', pageMock, [middlewareMock, secondMiddlewareMock])

        expect(route).toBeDefined()
        expect(route.path).toBe('/planner')
        expect(route.component).toBe(pageMock)
        expect(route.middlewares).toHaveLength(2)
        expect(route.middlewares).toContain(middlewareMock)
        expect(route.middlewares).toContain(secondMiddlewareMock)
    })

    it('[Should] Create a route without middleware', () => {
        const route = new Route('/', pageMock)

        expect(route.middlewares).toHaveLength(0)
    })

    it('[Should] Convert single middleware into an array', () => {
        const route = new Route('/admin', pageMock, middlewareMock)

        expect(Array.isArray(route.middlewares)).toBe(true)
        expect(route.middlewares).toHaveLength(1)
        expect(route.middlewares).toContain(middlewareMock)
    })

    it('[Should] Match dynamic param and parse it', () => {
        const route = new Route('/modules/:id', pageMock)

        expect(route.match('/modules/42')).toEqual({
            params: { id: '42' },
            query: {},
        })
    })

    it('[Should] Match query string and parse it', () => {
        const route = new Route('/users', pageMock)

        expect(route.match('/users?sort=asc&limit=10')).toStrictEqual({
            params: {},
            query: { sort: 'asc', limit: '10' },
        })
    })

    it('[Should] Match dynamic param and query string and parse them', () => {
        const route = new Route('/events/:eventId', pageMock)

        expect(route.match('/events/789?invite=true')).toStrictEqual({
            params: { eventId: '789' },
            query: { invite: 'true' },
        })
    })

    it('[Should] Return NULL for non-matching path', () => {
        const route = new Route('/users/:id', pageMock)

        expect(route.match('/accounts/42')).toBeNull()
    })

    it('[Should] Return NULL if segment counts differ', () => {
        const route = new Route('/projects/:projectId', pageMock)

        expect(route.match('/projects/123/files')).toBeNull()
    })

    it('[Should not] Match if the dynamic parameter is missing in the URL', () => {
        const route = new Route('/messages/:id', pageMock)

        expect(route.match('/messages/')).toBeNull()
    })

    it('[Should not] Match if base path differs', () => {
        const route = new Route('/modules/:id', pageMock)

        expect(route.match('/admins/244')).toBeNull()
    })

    it('[Should not] Match if query string is malformed (e.g., missing "=")', () => {
        const route = new Route('/search/data', pageMock)

        expect(route.match('/search/data?sort&filter')).toStrictEqual({
            params: {},
            query: { sort: '', filter: '' },
        })
    })
})
