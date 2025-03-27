// Import the router instance from the router module
import { router } from '@/router.js'

/**
 * Handle client-side navigation:
 * - Intercepts click events on `<a>` tags.
 * - Prevents the default browser navigation behavior if the link is an internal link.
 * - Uses the router to handle navigation without a full page reload.
 *
 * Conditions:
 * - `closest('a')`: Ensures the target is an `<a>` element (or a child of one).
 * - `anchor.href.startsWith(window.location.origin)`: Confirms it's an internal link.
 * - `getAttribute('href') !== window.location.pathname`: Avoids unnecessary reloading of the same page.
 *
 * @param {Event} event - The click event object
 */
document.addEventListener(
    'click',
    event => {
        const anchor = event.target.closest('a')

        if (
            anchor &&
            anchor.href &&
            anchor.href.startsWith(window.location.origin) &&
            anchor.getAttribute('href') !== window.location.pathname
        ) {
            event.preventDefault() // Prevent default browser navigation
            router.navigate(anchor.getAttribute('href')) // Handle with client-side router
        }
    },
    { passive: true },
)
