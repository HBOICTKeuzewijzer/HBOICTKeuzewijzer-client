import { RouteGroup } from '@/models'
import { Route } from '@models'
import { EnsureCohortIsSet, RequireAuthCookie } from '@http/middleware'

/**
 * Defines the application routes.
 * @type {Route[]}
 */
export const routes = [
    ...new RouteGroup([new EnsureCohortIsSet()])
        .add('/', () => import('@/http/pages/page.js'))
        .add('/:uuid', () => import('@/http/pages/page.js')).routes,

    ...new RouteGroup([new RequireAuthCookie()])
        .add('/saved-routes', () => import('@pages/saved-routes/page.js'))
        .add('/messages', () => import('@pages/messages/page.js')).routes,

    ...new RouteGroup([new RequireAuthCookie()], '/admin')
        .add('/', () => import('@/http/pages/admin/page.js'))
        .add('/modules', () => import('@/http/pages/admin/modules/page.js'))
        .add('/oer', () => import('@/http/pages/admin/oer/page.js'))
        .add('/categorien', () => import('@/http/pages/admin/category/page.js'))
        .add('/rollen-toewijzen', () => import('@/http/pages/admin/role-assignment/page.js'))
        .add('/slb-relaties', () => import('@/http/pages/admin/slb-relations/page.js')).routes,
]
