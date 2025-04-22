import { Middleware } from '@http/middleware'
import { router } from '@http/router'
import { Cookie } from '@utils'

/**
 * Inherits from the base `Middleware` class.
 */
export class RequireAuthCookie extends Middleware {
    /**
     * @param {Object} context - The context object containing route and request details.
     * @returns {Promise<boolean>} Resolves to `true` if the middleware passes, `false` otherwise.
     */
    async handle(context) {
        if (Cookie.get('x-session') == null) {
            router.redirect('/')
            return false;
        }

        return true
    }
}
