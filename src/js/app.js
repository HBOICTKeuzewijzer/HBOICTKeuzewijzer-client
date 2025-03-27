import { router } from '@/router.js'

document.addEventListener('DOMContentLoaded', () => router.navigate(window.location.pathname))
document.addEventListener('click', event => {
    const anchor = event.target.closest('a')
    if (anchor && anchor.href.startsWith(window.location.origin)) {
        event.preventDefault()
        router.navigate(anchor.getAttribute('href'))
    }
})
