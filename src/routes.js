import { RouteGroup, Route } from '@/models'
import { EnsureAuthCookieIsSet, EnsureCohortIsSet, RequireRole, SetAuthCookie } from '@http/middleware'
import Role from '@models/role'

/**
 * Defines the application routes.
 * @type {Route[]}
 */
export const routes = [
    new Route('/', () => import('@pages/page.js'), new SetAuthCookie()),
    // new Route('/', () => import('@pages/page.js')),
    new Route('/guest', () => import('@pages/guest/planner/page.js'), new SetAuthCookie()),
    new Route('/login', () => import('@pages/login.js')),
    new Route('/logout', () => import('@pages/logout.js')),

    ...new RouteGroup([new SetAuthCookie(), new EnsureAuthCookieIsSet(), new EnsureCohortIsSet(), new RequireRole([Role.Student])])
        .add('/modules', () => import('@pages/modules/page.js'))
        .add('/studieroute', () => import('@pages/planner/page.js'))
        .add('/studieroute/:uuid', () => import('@pages/planner/page.js')).routes,

    ...new RouteGroup([new SetAuthCookie(), new EnsureAuthCookieIsSet()], '/profile')
        .add('/settings', () => import('@pages/profile/settings/page.js'))
        .add('/mijn-routes', () => import('@pages/profile/studyroutes/page'), [new RequireRole([Role.Student])]).routes,

    ...new RouteGroup([new SetAuthCookie(), new EnsureAuthCookieIsSet()])
        .add('/messages', () => import('@pages/messages/page.js'))
        .add('/messages/:uuid', () => import('@pages/messages/page.js')).routes,

    ...new RouteGroup([new SetAuthCookie(), new EnsureAuthCookieIsSet({ silent: true }), new RequireRole([Role.SLB])])
        .add('/slb', () => import('@pages/slb/page.js'))
        .add('/slb/review/:uuid', () => import('@pages/slb/review/page.js')).routes,

    ...new RouteGroup([new SetAuthCookie(), new EnsureAuthCookieIsSet({ silent: true })], '/admin')
        .add('/', () => import('@pages/admin/page.js'), [new RequireRole([Role.ModuleAdmin, Role.SystemAdmin])])
        .add('/modules', () => import('@/http/pages/admin/modules/page.js'), [new RequireRole([Role.ModuleAdmin, Role.SystemAdmin])])
        .add('/modules/create', () => import('@/http/pages/admin/modules/modules-create/page.js'), [new RequireRole([Role.ModuleAdmin, Role.SystemAdmin])])
        .add('/modules/edit/:uuid', () => import('@/http/pages/admin/modules/modules-edit/page.js'), [new RequireRole([Role.ModuleAdmin, Role.SystemAdmin])])
        .add('/oer', () => import('@pages/admin/oer/page.js'), [new RequireRole([Role.ModuleAdmin, Role.SystemAdmin])])
        .add('/oer/create', () => import('@pages/admin/oer/oer-create/page.js'), [new RequireRole([Role.ModuleAdmin, Role.SystemAdmin])])
        .add('/oer/edit/:uuid', () => import('@pages/admin/oer/oer-edit/page.js'), [new RequireRole([Role.ModuleAdmin, Role.SystemAdmin])])
        .add('/categorien', () => import('@pages/admin/category/page.js'), [new RequireRole([Role.ModuleAdmin, Role.SystemAdmin])])
        .add('/categorien/create', () => import('@/http/pages/admin/category/category-create/page.js'), [new RequireRole([Role.ModuleAdmin, Role.SystemAdmin])])
        .add('/categorien/edit/:uuid', () => import('@/http/pages/admin/category/category-edit/page.js'), [new RequireRole([Role.ModuleAdmin, Role.SystemAdmin])]).routes,
]
