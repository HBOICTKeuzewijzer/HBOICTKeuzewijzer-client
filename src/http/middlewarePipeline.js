import { Middleware } from '@http/middleware'
import { MiddlewareResult } from '@/models'
import MiddlewareStatus from '@models/routing/middlewareStatus'

/**
 * Class representing a middleware pipeline for processing requests.
 */
export class MiddlewarePipeline {
    /**
     * Executes an array of middleware functions sequentially.
     * If any middleware function returns a falsy value or throws an error, the pipeline stops.
     *
     * @param {Middleware[]} middlewares - An array of middleware functions.
     * @param {Object} context - The context passed to each middleware.
     * @returns {Promise<MiddlewareResult>} - Resolves to MiddlewareResult.
     */
    static async run(middlewares, context) {
        if (!Array.isArray(middlewares)) {
            throw new Error('[MiddlewarePipeline] Middlewares must be an array')
        }

        try {
            for (const middleware of middlewares) {
                if (!(middleware instanceof Middleware)) continue

                /** @type {MiddlewareResult} */
                const result = await middleware.handle(context)

                if (result.status === MiddlewareStatus.Success) continue
                return result
            }
            return MiddlewareResult.success()
        } catch (error) {
            console.error('[MiddlewarePipeline] Error in middleware:', error)
            return false
        }
    }
}
