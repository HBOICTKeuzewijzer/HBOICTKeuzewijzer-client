import { MiddlewarePipeline } from '@http/middlewarePipeline'
import { routes } from '@/routes'

class Router {
    /** @type {HTMLElement} */
    #DOMContainer
    /** @type {Array} The list of application routes. */
    #routes
    #currentPageComponent

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
        const matchedRoute = this.#routes
            .slice() // Clone the original route list to avoid mutating it during sorting
            .sort((a, b) => {
                // Split paths into segments for comparison (e.g., "/admin/modules/:uuid" → ["admin", "modules", ":uuid"])
                const aSegments = a.path.replace(/^\/|\/$/g, '').split('/')
                const bSegments = b.path.replace(/^\/|\/$/g, '').split('/')

                // Determine if the route is dynamic (i.e., contains parameters like ":uuid")
                const aIsDynamic = aSegments.some(s => s.startsWith(':'))
                const bIsDynamic = bSegments.some(s => s.startsWith(':'))

                // Static routes always come before dynamic routes
                if (aIsDynamic && !bIsDynamic) return 1
                if (!aIsDynamic && bIsDynamic) return -1

                // If both routes are dynamic/static, prefer the one with fewer dynamic segments
                const aDynamicCount = aSegments.filter(s => s.startsWith(':')).length
                const bDynamicCount = bSegments.filter(s => s.startsWith(':')).length

                if (aDynamicCount !== bDynamicCount) {
                    return aDynamicCount - bDynamicCount
                }

                // Fallback: alphabetically compare the full path strings to ensure consistent ordering
                return a.path.localeCompare(b.path)
            })
            // Find the first route that matches the current URL
            .find(route => route.match(this.currentRoute))

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
     * /**
     * Render the content in the DOM container.
     * @param {Function} componentLoader - A function that dynamically imports the page component.
     * @param {Object} params - Parameters extracted from the route.
     * @returns {Promise<void>}
     */
    async #render(componentLoader, params) {
        // Call the onBeforePageUnloaded lifecycle hook if it exists.
        this.#currentPageComponent?.default.onBeforePageUnloaded?.()

        // Load the page component dynamically.
        this.#currentPageComponent = await componentLoader()
        const content = this.#currentPageComponent.default(params)

        // Load the layout and wrap the content inside it.
        const layout = (await import('@pages/layout.js')).default(content)

        // Clear the container and append the new layout.
        this.#DOMContainer.innerHTML = ''
        this.#DOMContainer.appendChild(layout instanceof HTMLElement ? layout : this.#createElementFromHTML(layout))

        // Call the onPageLoaded lifecycle hook if it exists.
        this.#currentPageComponent.default.onPageLoaded?.()
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
