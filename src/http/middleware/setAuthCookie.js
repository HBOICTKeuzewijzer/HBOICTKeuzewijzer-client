import { getCurrentUser } from '@utils/getCurrentUser'
import { Middleware } from '@http/middleware'
import { Cookie } from '@utils'
import { MiddlewareResult } from '@models';

/**
 * Inherits from the base `Middleware` class.
 */
export class SetAuthCookie extends Middleware {
    /**
     * @param {Object} context - The context object containing route and request details.
     * @returns {Promise<MiddlewareResult>} Resolves to `true` if the middleware passes, `false` otherwise.
     */
    // eslint-disable-next-line no-unused-vars
    async handle(context) {
        try {
            if (Cookie.get('x-session') === null) {
                const me = await getCurrentUser();

                if (me !== null && me !== undefined) {
                    document.cookie = `${encodeURIComponent('x-session')}=${encodeURIComponent(JSON.stringify(me.asJson()))}; path=/`
                }
            }

            return MiddlewareResult.success();
        } catch (err) {
            console.warn(err)
            return MiddlewareResult.success();
        }
    }
}
