import { Route, RouteGroup } from '@/models'
import { AuthMiddleware } from '@/http/middleware'

/**
 * Defines the application routes.
 * @type {Route[]}
 */
export const routes = [
    new Route('/', () => import('@pages/page.js')),
    new Route('/view/:uuid', () => import('@pages/page.js')),

    ...new RouteGroup([AuthMiddleware]).add('/admin').routes,
]
