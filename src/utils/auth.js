import { User } from '@models'
import { Cookie } from '@utils'

/**
 * Utility class for authentication-related helpers.
 */
export class Auth {
    /**
     * Checks whether the user is currently logged in.
     * @returns {boolean} True if a session cookie is present.
     */
    static isLoggedIn() {
        return Cookie.get('x-session') !== null
    }

    /**
     * Retrieves the authenticated user from the session cookie.
     * @returns {User|null} The authenticated User instance, or null if not logged in or invalid.
     */
    static getUser() {
        if (!this.isLoggedIn()) return null

        const rawUser = Cookie.get('x-session')
        if (!rawUser) return null

        try {
            const parsed = JSON.parse(rawUser)
            return new User(parsed)
        } catch {
            return null
        }
    }
}
