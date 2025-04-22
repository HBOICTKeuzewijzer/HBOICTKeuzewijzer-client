import { RouteGroup } from '@/models'
import { EnsureCohortIsSet, RequireAuthCookie } from '@http/middleware'

/**
 * Defines the application routes.
 * @type {Route[]}
 */
export const routes = [
    ...new RouteGroup()
        .add('/admin/modules', () => import('@pages/modules/page.js'))
        .add('/admin/oer', () => import('@pages/oer/page.js'))
        .add('/admin/categorien', () => import('@pages/categorien/page.js'))
        .add('/admin/rollen-toewijzen', () => import('@pages/rollen-toewijzen/page.js'))
        .add('/admin/slb-relaties', () => import('@pages/slb-relaties/page.js')).routes,

    ...new RouteGroup([new EnsureCohortIsSet()])
        .add('/', () => import('@/http/pages/page.js'))
        .add('/:uuid', () => import('@/http/pages/page.js')).routes,

    ...new RouteGroup([new RequireAuthCookie()])
        .add('/saved-routes', () => import('@pages/saved-routes/page.js'))
        .add('/messages', () => import('@pages/messages/page.js'))
        .add('/students', () => import('@pages/students/page.js'))
        .add('/admin/modules', () => import('@pages/modules/page.js'))
        .add('/admin/modules/:uuid', () => import('@pages/modules/page.js')).routes,
]
