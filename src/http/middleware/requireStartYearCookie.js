import { Middleware } from '@http/middleware'
import { Cookie } from '@utils'

/**
 * Inherits from the base `Middleware` class.
 */
export class RequireStartYearCookie extends Middleware {
    /**
     * Handle the middleware logic to check for authentication.
     * @param {Object} context - The context object containing route and request details.
     * @returns {Promise<boolean>} Resolves to `true` if the middleware passes, `false` otherwise.
     */
    async handle(context) {
        const cookie = Cookie.get('Cohort')
        return cookie
    }
}
