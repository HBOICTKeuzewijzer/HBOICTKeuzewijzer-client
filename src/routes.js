import { Route, RouteGroup } from '@/models'
import { RequireAuthCookie, RequireStartYearCookie } from '@http/middleware'

/**
 * Defines the application routes.
 * @type {Route[]}
 */
export const routes = [
    new Route('/', () => import('@pages/page.js')),

    ...new RouteGroup([RequireStartYearCookie], '/planner')
        .add('/', () => import('@/http/pages/page.js'))
        .add('/:uuid', () => import('@/http/pages/page.js')).routes,

    ...new RouteGroup([RequireAuthCookie, RequireStartYearCookie])
        .add('/messages', () => import('@pages/messages/page.js'))
        .add('/admin/modules', () => import('@pages/modules/page.js'))
        .add('/admin/modules/:uuid', () => import('@pages/modules/page.js')).routes,
]
