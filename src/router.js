class Router {
    /** @type {HTMLElement} */
    #DOMContainer

    constructor() {
        // Caching the DOM container for future use.
        this.#DOMContainer = document.getElementById('_app')

        document.addEventListener('DOMContentLoaded', this.#handleRoute) // Handle routing for initial page load.
        window.addEventListener('popstate', this.#handleRoute) // Listen for route changes (using popstate for back/forward navigation)
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
        let pagePath = this.currentRoute ? `${this.currentRoute}/page` : 'page'
        console.log(pagePath)
        try {
            const { default: page } = await import(`./pages/${pagePath}.js`)
            return page
        } catch {
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
            console.log(page)
            // If a layout is available, wrap the page with it.
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
        // If the content is of type 'String' we set the innerHTML.
        this.#DOMContainer.innerHTML = typeof content === 'string' ? content : ''

        // If the Content is an HTMLElement we append it instead.
        if (content instanceof HTMLElement) this.#DOMContainer.appendChild(content)
    }
}

const router = new Router()

export { router }
