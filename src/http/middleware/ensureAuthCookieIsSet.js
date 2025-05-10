import { Middleware } from '@http/middleware'
import { Cookie } from '@utils'
import { router } from '../router';

/**
 * Inherits from the base `Middleware` class.
 */
export class EnsureAuthCookieIsSet extends Middleware {
    #silent = false;

    /**
     * 
     * @param {Object} options
     * @param {boolean} options.silent Decides if we redirect to index or if not silent to login
     */
    constructor({ silent = false } = {}) {
        super();
        this.#silent = silent;
    }


    /**
     * @param {Object} context - The context object containing route and request details.
     * @returns {Promise<boolean>} Resolves to `true` if the middleware passes, `false` otherwise.
     */
    // eslint-disable-next-line no-unused-vars
    async handle(context) {
        try {
            const sessionCookie = Cookie.get('x-session');

            if (sessionCookie === null) {
                if (this.#silent) {
                    router.navigate('/');
                } else {
                    router.navigate('/login');
                }
                return false;
            }

            return true;
        } catch {
            return false;
        }
    }
}
