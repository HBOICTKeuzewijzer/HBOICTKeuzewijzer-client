import { MiddlewareResult } from '@/models'
import { Middleware } from '@http/middleware'

/**
 * Inherits from the base `Middleware` class.
 */
export class EnsureCohortIsSet extends Middleware {
    /**
     * @param {Object} context - The context object containing route and request details.
     * @returns {Promise<boolean>} Resolves to `true` if the middleware passes, `false` otherwise.
     */
    async handle(context) {
        return MiddlewareResult.success()
    }
}
