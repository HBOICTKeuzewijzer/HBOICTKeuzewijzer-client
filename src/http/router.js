import { MiddlewarePipeline } from '@http/middlewarePipeline'
import { routes } from '@/routes'

class Router {
    /** @type {HTMLElement} */
    #DOMContainer
    /** @type {Array} The list of application routes. */
    #routes

    constructor() {
        this.#routes = routes

        // Caching the DOM container for future use.
        this.#DOMContainer = document.getElementById('_app')

        // Listen for initial page load and history navigation.
        document.addEventListener('DOMContentLoaded', this.#handleRoute.bind(this))
        window.addEventListener('popstate', this.#handleRoute.bind(this))
    }

    /**
     * Get the current route path (without leading slash).
     * @returns {string}
     */
    get currentRoute() {
        return window.location.pathname
    }

    /**
     * Navigate to a new page.
     * @param {string} path - The target path to navigate to.
     * @returns {void}
     */
    navigate(path) {
        window.history.pushState({}, '', path)
        this.#handleRoute()
    }

    /**
     * Redirects to a new URL
     * @param {string} url - The URL to redirect to
     */
    redirect(url) {
        if (this.#isExternalURL(url)) {
            window.location.href = url
            return
        }

        this.navigate(url)
    }

    /**
     * Handle the route change and render the appropriate page.
     * @returns {Promise<void>}
     */
    async #handleRoute() {
        // Find a matching route based on the current path.
        const matchedRoute = this.#routes.find(route => route.match(this.currentRoute))
        if (!matchedRoute) return this.#render(() => import('@pages/404.js'))

        const currentRoute = this.currentRoute
        const params = matchedRoute.match(this.currentRoute + window.location.search)
        const context = { currentRoute, params }

        // Execute middleware before rendering the page.
        const middlewarePassed = await MiddlewarePipeline.run(matchedRoute.middlewares, context)
        if (!middlewarePassed) return this.#render(() => import('@pages/404.js'))

        // Render the matched route component.
        this.#render(matchedRoute.component, params)
    }

    /**
     * Render the content in the DOM container.
     * @param {Function} componentLoader - A function that dynamically imports the page component.
     * @param {Object} params - Parameters extracted from the route.
     * @returns {Promise<void>}
     */
    async #render(componentLoader, params) {
        // Load the page component dynamically.
        const PageComponent = await componentLoader()
        const content = PageComponent.default(params)

        // Load the layout and wrap the content inside it.
        const layout = (await import('@pages/layout.js')).default(content)

        // Clear the container and append the new layout.
        this.#DOMContainer.innerHTML = ''
        this.#DOMContainer.appendChild(layout instanceof HTMLElement ? layout : this.#createElementFromHTML(layout))
    }

    /**
     * Create an HTML element from a string.
     * @param {string} htmlString - The HTML string to convert.
     * @returns {HTMLElement} The created HTML element.
     */
    #createElementFromHTML(htmlString) {
        return new DOMParser().parseFromString(htmlString, 'text/html').body.firstChild
    }

    /**
     * Checks if a URL is external
     * @param {string} url - The URL to check
     * @returns {boolean}
     */
    #isExternalURL(url) {
        try {
            new URL(url)
            return url.startsWith('http') || url.startsWith('//')
        } catch {
            return false
        }
    }
}

/**
 * Singleton instance of the Router.
 * @type {Router}
 */
export const router = new Router()
