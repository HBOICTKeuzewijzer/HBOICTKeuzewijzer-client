/**
 * Represents a single route in the application.
 */
export class Route {
    /** @type {string} The route path. */
    #path
    /** @type {Function} A function that dynamically imports the component for this route. */
    #component
    /** @type {Array<Function>} Middleware functions to be applied to this route. */
    #middlewares
    /** @type {Array<string>} Keys of dynamic parameters in the route path. */
    #paramKeys

    /**
     * Create a new Route instance.
     * @param {string} path - The route path (supports dynamic parameters with `:` prefix).
     * @param {Function} component - A function that dynamically imports the page component.
     * @param {Array<Function>} [middlewares=[]] - Middleware functions to be applied to this route.
     */
    constructor(path, component, middlewares = []) {
        this.#path = path
        this.#component = component
        this.#middlewares = middlewares
        this.#paramKeys = this.#extractParams(path)
    }

    /**
     * Get the route path.
     * @returns {string} The path of the route.
     */
    get path() {
        return this.#path
    }

    /**
     * Get the component loader function for this route.
     * @returns {Function} The component loader function.
     */
    get component() {
        return this.#component
    }

    /**
     * Get the middleware functions applied to this route.
     * @returns {Array<Function>} The list of middleware functions.
     */
    get middlewares() {
        return this.#middlewares
    }

    /**
     * Extract dynamic parameters from a route path (e.g., `/users/:id`).
     * @param {string} path - The route path.
     * @returns {Array<string>} An array of dynamic parameter keys.
     */
    #extractParams(path) {
        return (path.match(/:[^/]+/g) || []).map(param => param.substring(1))
    }

    /**
     * Check if a given URL matches this route and extract parameters.
     * @param {string} url - The URL to match against this route.
     * @returns {Object|null} An object containing extracted parameters if matched, otherwise `null`.
     */
    match(url) {
        const pathSegments = this.path.split('/')
        const urlSegments = url.split('/')

        if (pathSegments.length !== urlSegments.length) return null

        const params = {}
        for (let i = 0; i < pathSegments.length; i++) {
            if (pathSegments[i].startsWith(':')) {
                params[pathSegments[i].substring(1)] = urlSegments[i]
            } else if (pathSegments[i] !== urlSegments[i]) {
                return null
            }
        }

        return params
    }
}
