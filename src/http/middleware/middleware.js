/**
 * Represents a base middleware class.
 * Other middleware classes should extend this class and implement the `handle` method.
 */
export class Middleware {
    /**
     * Handle the middleware logic.
     * @param {Object} context - The context object containing route and request details.
     * @returns {Promise<boolean>} Resolves to `true` to continue the pipeline, `false` to stop.
     * In the default implementation, always resolves to `true`.
     */
    // eslint-disable-next-line no-unused-vars
    async handle(context) {
        // Logic for the middleware goes here
        // Return false if the middleware fails or does not allow continuation
        return true // Otherwise return true to continue the pipeline
    }
}
