import { RouteGroup, Route } from '@/models'
import { EnsureAuthCookieIsSet, EnsureCohortIsSet, RequireRole, SetAuthCookie } from '@http/middleware'
import Role from '@models/role'

/**
 * Defines the application routes.
 * @type {Route[]}
 */
export const routes = [
    new Route('/', () => import('@pages/page.js'), new SetAuthCookie()),
    new Route('/guest', () => import('@pages/guest/planner/page.js'), new SetAuthCookie()),

    ...new RouteGroup([new SetAuthCookie(), new EnsureAuthCookieIsSet(), new EnsureCohortIsSet()])
        .add('/studieroute', () => import('@pages/planner/page.js'))
        .add('/studieroute/:uuid', () => import('@pages//planner/page.js')).routes,

    ...new RouteGroup([new SetAuthCookie(), new EnsureAuthCookieIsSet()], '/profile')
        .add('/mijn-routes', () => import('@pages/profile/studyroutes/page')).routes,

    ...new RouteGroup([new SetAuthCookie(), new EnsureAuthCookieIsSet()])
        .add('/messages/:uuid', () => import('@pages/messages/page.js'))
        .add('/messages', () => import('@pages/messages/page.js')).routes,

    ...new RouteGroup([new SetAuthCookie(), new EnsureAuthCookieIsSet({ silent: true })], '/admin')
        .add('/', () => import('@pages/admin/page.js'), [new RequireRole([Role.ModuleAdmin, Role.SystemAdmin])])
        .add('/modules', () => import('@pages/admin/modules/page.js'), [new RequireRole([Role.ModuleAdmin, Role.SystemAdmin])])
        .add('/oer', () => import('@pages/admin/oer/page.js'), [new RequireRole([Role.ModuleAdmin, Role.SystemAdmin])])
        .add('/categorien', () => import('@pages/admin/category/page.js'), [new RequireRole([Role.ModuleAdmin, Role.SystemAdmin])])
        .add('/rollen-toewijzen', () => import('@pages/admin/role-assignment/page.js'), [new RequireRole([Role.SystemAdmin])])
        .add('/slb-relaties', () => import('@pages/admin/slb-relations/page.js'), [new RequireRole([Role.SystemAdmin])]).routes,
]
