import { Middleware } from '@http/middleware'
import { router } from '@http/router'
import { Cookie, fetcher } from '@utils'

/**
 * Inherits from the base `Middleware` class.
 */
export class SetAuthCookie extends Middleware {
    /**
     * @param {Object} context - The context object containing route and request details.
     * @returns {Promise<boolean>} Resolves to `true` if the middleware passes, `false` otherwise.
     */
    // eslint-disable-next-line no-unused-vars
    async handle(context) {
        try {
            let me = await fetcher('api/auth/me')

            Cookie.set(
                'x-session',
                JSON.stringify({
                    id: me.id,
                    name: me.displayName.replace(' (student)', ''),
                    email: me.email,
                }),
            )

            return true
        } catch {
            router.redirect('/')
            return false
        }
    }
}
