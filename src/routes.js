import { RouteGroup } from '@/models'
import { Route } from '@models'
import { EnsureCohortIsSet, RequireAuthCookie } from '@http/middleware'

/**
 * Defines the application routes.
 * @type {Route[]}
 */
export const routes = [
    new Route('/admin', () => import('@pages/admin/page.js')),
    new Route('/admin/modules', () => import('@pages/admin/modules/page.js')),
    new Route('/admin/oer', () => import('@pages/admin/oer/page.js')),

    ...new RouteGroup([new RequireAuthCookie()])
        .add('/saved-routes', () => import('@pages/saved-routes/page.js'))
        .add('/messages', () => import('@pages/messages/page.js'))
        .add('/admin/modules', () => import('@pages/modules/page.js'))
        .add('/admin/modules', () => import('@pages/admin/modules/page.js'))
        .add('/admin/modules/:uuid', () => import('@pages/modules/page.js')).routes,

    ...new RouteGroup([new EnsureCohortIsSet()])
        .add('/', () => import('@/http/pages/page.js'))
        .add('/:uuid', () => import('@/http/pages/page.js')).routes,
]
