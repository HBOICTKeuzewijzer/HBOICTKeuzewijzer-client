import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Cookie } from '@utils'

/**
 * Cookie Utility Tests
 * ------------------------------------
 * These tests validate the functionality of setting, getting, and managing cookies in the document.
 * The tests cover various scenarios such as setting, retrieving, overwriting cookies,
 * handling invalid cookie names and values, and verifying the behavior of non-existent cookies.
 *
 * The following test cases are included:
 * - [Should] Set a cookie in document.cookie,
 * - [Should] Retrieve the correct value for an existing cookie,
 * - [Should] Return NULL if the cookie does not exist,
 * - [Should] Overwrite an existing cookie with the same name,
 * - [Should not] Set a cookie with an invalid name,
 * - [Should not] Overwrite cookie with invalid value.
 */
describe('[Utils] Cookie', () => {
    /** @type {string} The name of the test cookie. */
    const cookieNameMock = 'testCookie'
    /** @type {string} The value of the test cookie. */
    const cookieValueMock = 'testValue'

    /** @type {string} Stores the current cookies. */
    let cookieStoreMock = ''

    /**
     * Mocks the document.cookie property for testing purposes.
     * - Allows you to mock the behavior of setting and getting cookies.
     * - Updates `cookieStore` when cookies are set or retrieved.
     */
    const mockCookie = () => {
        cookieStoreMock = '' // Empty the cookie store before each test

        Object.defineProperty(document, 'cookie', {
            get: () => cookieStoreMock,
            set: cookie => {
                const [keyValue] = cookie.split(';')
                const [key, value] = keyValue.split('=')
                const encodedValue = value.trim()

                // Regex to check if the cookie already exists in the store
                const regex = new RegExp(`(?:^|;\\s*)${key}=([^;]*)`)

                // If the cookie is already set we want to update it
                if (cookieStoreMock.match(regex)) {
                    cookieStoreMock = cookieStoreMock.replace(regex, `${key}=${encodedValue}`)
                } else {
                    cookieStoreMock += (cookieStoreMock ? '; ' : '') + `${key}=${encodedValue}`
                }
            },
            configurable: true,
        })
    }

    beforeEach(() => {
        mockCookie() // Initialize the mock before each test
    })

    afterEach(() => {
        // Clean up the mock after each test to avoid side effects
        delete document.cookie
    })

    it('[Should] Set a cookie in document.cookie', () => {
        Cookie.set(cookieNameMock, cookieValueMock)
        expect(document.cookie).toContain(`${cookieNameMock}=${cookieValueMock}`)
    })

    it('[Should] Retrieve the correct value for an existing cookie', () => {
        Cookie.set(cookieNameMock, cookieValueMock)
        expect(Cookie.get(cookieNameMock)).toBe(cookieValueMock)
    })

    it('[Should] Return NULL if the cookie does not exist', () => {
        expect(Cookie.get('non-existent-cookie')).toBeNull()
    })

    it('[Should] Overwrite an existing cookie with the same name', () => {
        Cookie.set(cookieNameMock, 'oldValue')
        Cookie.set(cookieNameMock, cookieValueMock)

        expect(Cookie.get(cookieNameMock)).toBe(cookieValueMock)
    })

    it('[Should not] Set a cookie with invalid name', () => {
        expect(() => Cookie.set('invalid cookie name', cookieValueMock)).toThrowError(
            '[Cookie - Set] Cannot set a cookie with an invalid name',
        )
        expect(() => Cookie.get('invalid cookie name')).toThrowError(
            '[Cookie - Get] Could not get cookie because the given name is invalid',
        )
    })

    it('[Should not] Overwrite cookie with invalid value', () => {
        Cookie.set(cookieNameMock, 'validValue')

        const initialCookie = Cookie.get(cookieNameMock)
        expect(initialCookie).toBe('validValue')

        expect(() => Cookie.set(cookieNameMock, null)).toThrowError(
            '[Cookie - Set] Cannot set a cookie with an invalid value',
        )

        const cookieAfterAttempt = Cookie.get(cookieNameMock)
        expect(cookieAfterAttempt).toBe('validValue')
    })
})
