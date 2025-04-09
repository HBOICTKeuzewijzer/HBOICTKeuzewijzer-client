import { Route } from '@models'

/**
 * Represents a group of routes that share common middleware and an optional prefix.
 */
export class RouteGroup {
    /** @type {Array<Function>} Middleware functions applied to all routes in the group. */
    #middlewares
    /** @type {string} A prefix applied to all routes in the group. */
    #prefix
    /** @type {Array<Route>} The list of routes within the group. */
    #routes

    /**
     * Create a new RouteGroup.
     * @param {Array<Function>} [middlewares=[]] - An array of middleware functions to be applied to all routes.
     * @param {string} [prefix=''] - An optional prefix for all routes in the group.
     */
    constructor(middlewares = [], prefix = '') {
        this.#middlewares = middlewares
        this.#prefix = prefix
        this.#routes = []
    }

    /**
     * Get the list of routes within the group.
     * @returns {Array<Route>} The routes in the group.
     */
    get routes() {
        return this.#routes
    }

    /**
     * Add a new route to the group.
     * @param {string} path - The path of the route.
     * @param {Function} component - A function that dynamically imports the page component.
     * @param {Array<Function>} [routeMiddlewares=[]] - Additional middleware functions specific to this route.
     * @returns {RouteGroup} The current RouteGroup instance (for chaining).
     */
    add(path, component, routeMiddlewares = []) {
        // Construct the full path with the prefix if applicable.
        const fullPath = this.#prefix ? `${this.#prefix}${path}` : path
        const combinedMiddlewares = [...this.#middlewares, ...routeMiddlewares]

        // Create and add the new route to the group
        this.#routes.push(new Route(fullPath, component, combinedMiddlewares))
        return this // Return itself for method chaining.
    }
}
