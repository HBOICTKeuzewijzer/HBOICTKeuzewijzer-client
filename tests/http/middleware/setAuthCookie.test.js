import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { User } from '@/models'
import Role from '@models/role'

vi.mock('@utils/cookie', () => ({
    Cookie: {
        get: vi.fn(),
        set: vi.fn()
    }
}))

const user = new User({
    id: '1234',
    displayName: 'Jane Doe',
    email: 'jane@example.com',
    applicationUserRoles: [
        {
            role: Role.ModuleAdmin
        },
        {
            role: Role.SystemAdmin
        }
    ]
})

vi.mock('@/utils/getCurrentUser', () => ({
    getCurrentUser: vi.fn(() => {
        return user
    })
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

    it('is true', () => {
        expect(true).toBe(true)
    })

    it('sets x-session if missing', async () => {
        // Arrange
        Cookie.get.mockReturnValue(null)

        // Act
        const middleware = new SetAuthCookie()
        const result = await middleware.handle({})

        // Assert
        expect(result.status).toBe(MiddlewareStatus.Success)
        expect(Cookie.set).toHaveBeenCalledWith(
            'x-session',
            JSON.stringify(user.asJson())
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
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { })

        // Arrange
        Cookie.get.mockReturnValue(null)
        getCurrentUser.mockRejectedValue(new Error('fail'))

        // Act
        const middleware = new SetAuthCookie()
        const result = await middleware.handle({})

        // Assert
        expect(result.status).toBe(MiddlewareStatus.Success)
        expect(Cookie.set).not.toHaveBeenCalled()

        warnSpy.mockRestore()
    })
})
