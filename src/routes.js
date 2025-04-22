import { RouteGroup } from '@/models'
import { Route } from '@models'
import { EnsureCohortIsSet, RequireAuthCookie } from '@http/middleware'

/**
 * Defines the application routes.
 * @type {Route[]}
 */
export const routes = [
    // Voor test
    ...new RouteGroup()
        .add('/admin/', () => import('@/http/pages/admin/page.js'))
        .add('/admin/modules', () => import('@/http/pages/admin/modules/page.js'))
        .add('/admin/oer', () => import('@/http/pages/admin/oer/page.js'))
        .add('/admin/categorien', () => import('@/http/pages/admin/categorien/page.js'))
        .add('/admin/rollen-toewijzen', () => import('@/http/pages/admin/rollen-toewijzen/page.js'))
        .add('/admin/slb-relaties', () => import('@/http/pages/admin/slb-relaties/page.js')).routes,

    ...new RouteGroup([new EnsureCohortIsSet()])
        .add('/', () => import('@/http/pages/page.js'))
        .add('/:uuid', () => import('@/http/pages/page.js')).routes,

    ...new RouteGroup([new RequireAuthCookie()])
        .add('/saved-routes', () => import('@pages/saved-routes/page.js'))
        .add('/messages', () => import('@pages/messages/page.js')).routes,

    ...new RouteGroup([new EnsureCohortIsSet()])
        .add('/', () => import('@/http/pages/page.js'))
        .add('/:uuid', () => import('@/http/pages/page.js')).routes,
]
