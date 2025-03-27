class Router {
    /** @type {HTMLElement} */
    #DOMContainer

    constructor() {
        // Caching the DOM container for future use.
        this.#DOMContainer = document.getElementById('_app')

        document.addEventListener('DOMContentLoaded', this.#handleRoute) // Handle initial page load
        window.addEventListener('popstate', this.#handleRoute) // Handle back/forward navigation
    }

    /**
     * Get the current route path (without leading slash).
     * @returns {string}
     */
    get currentRoute() {
        const path = window.location.pathname.replace(/^[\\/]+|[\\/]+$/g, '')
        return path === '/' ? '' : path
    }

    /**
     * Get the current URL search parameters.
     * @returns {URLSearchParams}
     */
    get searchParams() {
        return new URLSearchParams(window.location.search)
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
     * Load the page content based on the current route.
     * @returns {Promise<HTMLElement|string>}
     */
    async #loadPage() {
        try {
            const { default: page } = this.currentRoute 
                ? await import(`./pages/${this.currentRoute}/page.js`)
                : await import('./pages/page.js')

            return page
        } catch (error) {
            const { default: page } = await import('./pages/404.js')
            return page
        }
    }

    /**
     * Handle the route change and render the appropriate page.
     * @returns {Promise<void>}
     */
    async #handleRoute() {
        try {
            const [page, layout] = await Promise.all([
                this.#loadPage(),
                import('./pages/layout.js').then(mod => mod.default).catch(() => null),
            ])

            // Render the page inside the layout, if layout exists, otherwise render page directly
            const content = layout ? layout(page(this.searchParams)) : page(this.searchParams)

            this.#render(content)
        } catch (error) {}
    }

    /**
     * Render the content in the DOM container.
     * @param {HTMLElement|string} content - The content to render.
     * @returns {void}
     */
    #render(content) {
        // Clear the container before appending new content
        this.#DOMContainer.innerHTML = ''

        // If the Content is an HTMLElement we append it instead.
        if (content instanceof HTMLElement) this.#DOMContainer.appendChild(content)
        else if (typeof content === 'string') this.#DOMContainer.innerHTML = content // If the content is of type 'String' we set the innerHTML.

    }
}

const router = new Router()

export { router }
