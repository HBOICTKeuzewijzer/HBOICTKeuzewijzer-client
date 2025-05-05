import { RouteGroup } from '@/models'
import { EnsureCohortIsSet, RequireAuthCookie, RequireRole } from '@http/middleware'
import Role from '@models/role'

/**
 * Defines the application routes.
 * @type {Route[]}
 */
export const routes = [
    ...new RouteGroup([new SetAuthCookie(), new EnsureCohortIsSet()])
        .add('/', () => import('@/http/pages/page.js'))
        .add('/:uuid', () => import('@/http/pages/page.js')).routes,

    ...new RouteGroup([new SetAuthCookie()])
        .add('/saved-routes', () => import('@pages/saved-routes/page.js'))
        .add('/messages', () => import('@pages/messages/page.js')).routes,

    ...new RouteGroup([new RequireAuthCookie()], '/admin')
        .add('/', () => import('@/http/pages/admin/page.js'), [new RequireRole([Role.ModuleAdmin, Role.SystemAdmin])])
        .add('/modules', () => import('@/http/pages/admin/modules/page.js'), [new RequireRole([Role.ModuleAdmin, Role.SystemAdmin])])
        .add('/oer', () => import('@/http/pages/admin/oer/page.js'), [new RequireRole([Role.ModuleAdmin, Role.SystemAdmin])])
        .add('/categorien', () => import('@/http/pages/admin/category/page.js'), [new RequireRole([Role.ModuleAdmin, Role.SystemAdmin])])
        .add('/rollen-toewijzen', () => import('@/http/pages/admin/role-assignment/page.js'), [new RequireRole([Role.SystemAdmin])])
        .add('/slb-relaties', () => import('@/http/pages/admin/slb-relations/page.js'), [new RequireRole([Role.SystemAdmin])]).routes,
]
