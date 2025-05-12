import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@utils/cookie', () => ({
    Cookie: {
        get: vi.fn(),
        set: vi.fn()
    }
}))

vi.mock('@/utils/getCurrentUser', () => ({
    getCurrentUser: vi.fn()
}))

import { Cookie } from '@utils'
import { getCurrentUser } from '@/utils/getCurrentUser'
import { SetAuthCookie } from '@/http/middleware'
import MiddlewareStatus from '@models/routing/middlewareStatus'

describe('SetAuthCookie', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.resetModules()
        vi.clearAllMocks()
    })

    it('sets x-session if missing', async () => {
        // Arrange
        Cookie.get.mockReturnValue(null)
        getCurrentUser.mockResolvedValue({
            id: '1234',
            displayName: 'Jane Doe',
            email: 'jane@example.com'
        })

        // Act
        const middleware = new SetAuthCookie()
        const result = await middleware.handle({})

        // Assert
        expect(result.status).toBe(MiddlewareStatus.Success)
        expect(Cookie.set).toHaveBeenCalledWith(
            'x-session',
            JSON.stringify({
                id: '1234',
                name: 'Jane Doe',
                email: 'jane@example.com'
            })
        )
    })

    it('does not call set if x-session exists', async () => {
        // Arrange
        Cookie.get.mockReturnValue('some-session')

        // Act
        const middleware = new SetAuthCookie()
        const result = await middleware.handle({})

        // Assert
        expect(result.status).toBe(MiddlewareStatus.Success)
        expect(Cookie.set).not.toHaveBeenCalled()
        expect(getCurrentUser).not.toHaveBeenCalled()
    })

    it('still succeeds if getCurrentUser throws', async () => {
        // Arrange
        Cookie.get.mockReturnValue(null)
        getCurrentUser.mockRejectedValue(new Error('fail'))

        // Act
        const middleware = new SetAuthCookie()
        const result = await middleware.handle({})

        // Assert
        expect(result.status).toBe(MiddlewareStatus.Success)
        expect(Cookie.set).not.toHaveBeenCalled()
    })
})
