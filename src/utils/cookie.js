export class Cookie {
    /**
     * Get a specific cookie by name, or all cookies as an object.
     * @param {string} [name] - The name of the cookie to retrieve.
     * @returns {string|Object|null} - Returns cookie value if name is provided, or all cookies as an object.
     */
    static get(name) {
        const cookies = {}

        if (name.includes(' ')) throw new Error('[Cookie - Get] Could not get cookie because the given name is invalid')

        document.cookie.split(';').forEach(cookie => {
            const [rawKey, rawVal] = cookie.split('=')
            const key = decodeURIComponent(rawKey)
            const val = decodeURIComponent(rawVal || '')

            cookies[key] = val
        })

        return name ? (cookies[name] ?? null) : cookies
    }

    /**
     * Set a cookie with options.
     * @param {string} name
     * @param {string} value
     * @param {Object} [options]
     * @param {string} [options.path='/']
     * @param {string} [options.domain]
     * @param {number|Date|string} [options.expires=1] - In days, Date, or string.
     * @param {boolean} [options.secure=true]
     * @param {string} [options.sameSite='Lax']
     */
    static set(
        name,
        value,
        {
            path = '/',
            domain,
            expires = 1,
            secure = true,
            sameSite = 'Lax',
            httpOnly = false, // Can't be used in JS, but allowed for API compatibility
        } = {},
    ) {
        if (name.includes(' ')) throw new Error('[Cookie - Set] Cannot set a cookie with an invalid name')
        if (!value) throw new Error('[Cookie - Set] Cannot set a cookie with an invalid value')

        const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`]

        const exp =
            typeof expires === 'number'
                ? new Date(Date.now() + expires * 864e5)
                : expires instanceof Date
                  ? expires
                  : new Date(expires)

        parts.push(`expires=${exp.toUTCString()}`)
        parts.push(`path=${path}`)

        if (domain) parts.push(`domain=${domain}`)
        if (secure) parts.push(`secure`)
        if (sameSite) parts.push(`samesite=${sameSite.toLowerCase()}`)
        if (httpOnly) parts.push(`httponly`)

        document.cookie = parts.join('; ')
    }
}
