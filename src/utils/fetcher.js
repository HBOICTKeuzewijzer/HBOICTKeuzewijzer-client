import { router } from '@http/router'

/**
 * Makes an HTTP request to the specified path using the provided options.
 *
 * @param {string} path - The API endpoint path (without leading `/`).
 * @param {RequestInit} options - The options for the fetch request.
 * @param {string} [options.method] - The HTTP method (`GET`, `POST`, `PUT`, `DELETE`).
 * @param {HeadersInit} [options.headers] - The headers to include in the request.
 * @param {object|string} [options.body] - The request body, which will be stringified for `POST` and `PUT`.
 *
 * @returns {Promise<any>} The parsed JSON response.
 *
 * @throws {Error} If the request fails or returns a non-OK status.
 */
export async function fetcher(path, options) {
    /** @type {string} */
    const url = `${import.meta.env.VITE_API_URL}/${path.replace(/^\//, '')}`

    /** @type {string} */
    const method = options?.method ?? 'GET'

    /** @type {HeadersInit} */
    const headers = {
        'Content-Type': 'application/json',
        ...options?.headers,
    }

    /** @type {RequestInit} */
    const fetchOptions = {
        ...options,
        method,
        headers,
        body: options?.body && ['POST', 'PUT'].includes(method) ? JSON.stringify(options.body) : undefined,
        credentials: 'include',
    }

    /** @type {Response} */
    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
        if (response.status === 401) {
            router.navigate('/')
        }

        const errorText = await response.text()
        throw new Error(`Failed to fetch data: ${errorText}`)
    }

    return response.json()
}
