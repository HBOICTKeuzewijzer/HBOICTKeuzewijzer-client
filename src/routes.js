import { Route, RouteGroup } from '@/models'
import { AuthMiddleware } from '@/http/middleware'

/**
 * Defines the application routes.
 * @type {Route[]}
 */
export const routes = [
    new Route('/', () => import('@pages/page.js')),
    new Route('/planner', () => import('@pages/planner/page.js')),
    new Route('/planner/:uuid', () => import('@pages/planner/page.js')),

    ...new RouteGroup([AuthMiddleware])
        .add('/messages', () => import('@pages/messages/page.js'))
        .add('/admin/modules', () => import('@pages/modules/page.js'))
        .add('/admin/modules/:uuid', () => import('@pages/modules/page.js'))
        .routes,
]
