import { describe, it, expect } from 'vitest'
import { RouteGroup } from '@models'

/**
 * RouteGroup model tests
 * ------------------------------------
 * These tests validate the functionality of defining and managing grouped routes.
 * They ensure that RouteGroup can:
 * - Define multiple routes with shared or individual middleware,
 * - Apply a common path prefix to all routes in the group,
 * - Support route chaining and dynamic route definition,
 * - Handle edge cases such as missing parameters or invalid input.
 *
 * The following test cases are included:
 *
 * Route Definition & Grouping:
 * - [Should] Apply common middleware to all routes in the group,
 * - [Should] Apply the prefix to the route path,
 * - [Should] Allow adding multiple routes with different middlewares,
 * - [Should] Return itself for chaining,
 * - [Should] Correctly handle routes with no prefix,
 *
 * Edge Cases & Validation:
 * - [Should not] Accept invalid paths,
 * - [Should not] Add route if component is missing,
 */
describe('[Models] RouteGroup', () => {
    /** @type {Function} */
    const dummyComponent = () => import('@pages/page')
    /** @type {Function} */
    const dummyMiddleware = () => {}
    /** @type {Function} */
    const secondDummyMiddleware = () => {}

    it('[Should] Apply common middleware to all routes in the group', () => {
        const group = new RouteGroup([dummyMiddleware, secondDummyMiddleware])
            .add('/users', dummyComponent)
            .add('/notifications', dummyComponent)

        expect(group.routes).toHaveLength(2)

        group.routes.forEach(route => {
            expect(route.middlewares).toContain(dummyMiddleware)
            expect(route.middlewares).toContain(secondDummyMiddleware)
        })
    })

    it('[Should] Apply the prefix to the route path', () => {
        const group = new RouteGroup([], '/admin').add('/dashboard', dummyComponent)

        expect(group.routes[0].path).toBe('/admin/dashboard')
    })

    it('[Should] Allow adding multiple routes with different middlewares', () => {
        const group = new RouteGroup([], '/admin')
            .add('/users', dummyComponent, [secondDummyMiddleware])
            .add('/settings', dummyComponent)

        expect(group.routes).toHaveLength(2)
        expect(group.routes[0].middlewares).toContain(secondDummyMiddleware)
        expect(group.routes[1].middlewares).toHaveLength(0)
    })

    it('[Should] Return itself for chaining', () => {
        const group = new RouteGroup()
        const result = group.add('/projects', dummyComponent)

        expect(result).toBe(group)
    })

    it('[Should] Correctly handle routes with no prefix', () => {
        const group = new RouteGroup().add('/contact', dummyComponent)

        expect(group.routes[0].path).toBe('/contact')
    })

    it('[Should not] Accept invalid paths', () => {
        const group = new RouteGroup()

        expect(() => {
            group.add('', dummyComponent)
        }).toThrowError('[Route] Cannot define a route without a path')
    })

    it('[Should not] Add route if component is missing', () => {
        const group = new RouteGroup()

        expect(() => {
            group.add('/missing', null)
        }).toThrowError('[Route] Cannot define a route without a component')
    })
})
