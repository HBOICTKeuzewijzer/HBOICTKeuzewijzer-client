import { getCurrentUser } from '@/utils/getCurrentUser'
import { Middleware } from '@http/middleware'
import { Cookie } from '@utils'
import { MiddlewareResult } from '@models';

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
            if (Cookie.get('x-session') === null) {
                const me = await getCurrentUser();

                Cookie.set(
                    'x-session',
                    JSON.stringify({
                        id: me.id,
                        name: me.displayName.replace(' (student)', ''),
                        email: me.email,
                    })
                );
            }

            return MiddlewareResult.builder.success();
        } catch {
            return MiddlewareResult.builder.success();
        }
    }
}
