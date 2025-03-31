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
     * Check if a given URL matches this route and extract parameters.
     * @param {string} url - The URL to match against this route.
     * @returns {Object|null} An object containing extracted parameters if matched, otherwise `null`.
     */
    match(url) {
        const [pathPart, queryString = ''] = url.replace(/^\/|\/$/g, '').split('?');
        const pathSegments = this.path.replace(/^\/|\/$/g, '').split('/');
        const urlSegments = pathPart.split('/');
    
        if (pathSegments.length !== urlSegments.length) return null;
    
        const params = pathSegments.reduce((params, segment, i) => {
            return segment.startsWith(':') 
                ? { ...params, [segment.slice(1)]: urlSegments[i] } 
                : (segment === urlSegments[i] ? params : null);
        }, {});
    
        const query = Object.fromEntries(new URLSearchParams(queryString));

        return { params, query };
    }
}
