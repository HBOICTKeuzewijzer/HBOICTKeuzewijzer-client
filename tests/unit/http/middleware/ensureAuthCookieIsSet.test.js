import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the Cookie module
vi.mock('@utils', () => ({
    Cookie: {
        get: vi.fn()
    }
}))

import { Cookie } from '@utils'
import { EnsureAuthCookieIsSet } from '@http/middleware'
import MiddlewareStatus from '@models/routing/middlewareStatus'

describe('EnsureAuthCookieIsSet', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.resetModules()
    })

    it('returns success if session cookie exists', async () => {
        // Arrange
        Cookie.get.mockReturnValue('mock-session')

        // Act
        const middleware = new EnsureAuthCookieIsSet()
        const result = await middleware.handle({ currentRoute: '/dashboard' })

        // Assert
        expect(result.status).toBe(MiddlewareStatus.Success)
    })

    it('redirects to /login with returnUrl if no session and silent is false', async () => {
        // Arrange
        Cookie.get.mockReturnValue(null)

        // Act
        const middleware = new EnsureAuthCookieIsSet({ silent: false })
        const result = await middleware.handle({ fullRoute: '/dashboard' })

        // Assert
        expect(result.status).toBe(MiddlewareStatus.Redirect)
        expect(result.redirectLocation).toBe('/login?returnUrl=/dashboard')
    })

    it('redirects to / if no session and silent is true', async () => {
        // Arrange
        Cookie.get.mockReturnValue(null)

        // Act
        const middleware = new EnsureAuthCookieIsSet({ silent: true })
        const result = await middleware.handle({ currentRoute: '/dashboard' })

        // Assert
        expect(result.status).toBe(MiddlewareStatus.Redirect)
        expect(result.redirectLocation).toBe('/')
    })

    it('returns failure if Cookie.get throws an error', async () => {
        // Arrange
        Cookie.get.mockImplementation(() => {
            throw new Error('Something broke')
        })

        // Act
        const middleware = new EnsureAuthCookieIsSet()
        const result = await middleware.handle({ currentRoute: '/dashboard' })

        // Assert
        expect(result.status).toBe(MiddlewareStatus.NotFound)
    })
})
