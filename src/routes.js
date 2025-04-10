import { Route, RouteGroup } from '@/models'
import { RequireAuthCookie, RequireStartYearCookie } from '@http/middleware'

/**
 * Defines the application routes.
 * @type {Route[]}
 */
export const routes = [
    new Route('/', () => import('@pages/planner/page.js')),

    ...new RouteGroup([RequireStartYearCookie], '/planner')
        .add('/', () => import('@pages/planner/page.js'))
        .add('/:uuid', () => import('@pages/planner/page.js')).routes,

    ...new RouteGroup([RequireAuthCookie, RequireStartYearCookie])
        .add('/messages', () => import('@pages/messages/page.js'))
        .add('/admin/modules', () => import('@pages/modules/page.js'))
        .add('/admin/modules/:uuid', () => import('@pages/modules/page.js')).routes,
]
