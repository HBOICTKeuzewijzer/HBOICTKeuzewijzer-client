import { getCurrentUser } from '@/utils/getCurrentUser'
import { Middleware } from '@http/middleware'
import { Cookie } from '@utils'

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

                const sessionExpiresAt = new Date(me.sessionExpiresAt);
                const now = new Date();

                // Convert the expiration time to number of *days* for Cookie.set
                const expiresInMs = sessionExpiresAt - now;
                const expiresInDays = expiresInMs / 86400000;

                Cookie.set(
                    'x-session',
                    JSON.stringify({
                        id: me.id,
                        name: me.displayName.replace(' (student)', ''),
                        email: me.email,
                    }),
                    {
                        expires: expiresInDays,
                    }
                );
            }

            return true;
        } catch {
            return true;
        }
    }
}
