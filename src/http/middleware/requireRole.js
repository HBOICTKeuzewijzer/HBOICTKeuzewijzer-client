import { getCurrentUser } from '@/utils/getCurrentUser'
import { Middleware } from '@http/middleware'
import { MiddlewareResult, User } from '@/models'
import { Auth } from '@/utils'

/**
 * @typedef {'User' | 'Student' | 'SLB' | 'ModuleAdmin' | 'SystemAdmin'} Role
 */


/**
 * Inherits from the base `Middleware` class.
 */
export class RequireRole extends Middleware {
    #acceptedRoles = [];

    /**
     * Sets the middleware and defines acceptable roles.
     * @param {Role[]} acceptedRoles 
     */
    constructor(acceptedRoles) {
        super()

        this.#acceptedRoles = [...this.#acceptedRoles, ...acceptedRoles]
    }


    /**
     * @param {Object} context - The context object containing route and request details.
     * @returns {Promise<boolean>} Resolves to `true` if the middleware passes, `false` otherwise.
     */
    async handle() {
        // const currentUser = await getCurrentUser();
        /** @type {User} */
        const currentUser = Auth.getUser()

        if (!currentUser?.roles) {
            return MiddlewareResult.notFound()
        }

        const hasRequiredRole = this.#acceptedRoles.some(role => currentUser.hasRole(role))

        if (!hasRequiredRole) {
            return MiddlewareResult.notFound()
        }

        return MiddlewareResult.success()
    }
}
