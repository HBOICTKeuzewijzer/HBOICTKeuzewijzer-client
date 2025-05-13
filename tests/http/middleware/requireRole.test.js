import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@/utils/getCurrentUser', () => ({
    getCurrentUser: vi.fn()
}))

// Apperently needed
import { routes } from '@/routes'
import Role from '@/models/role'
import { RequireRole } from '@/http/middleware'
import { getCurrentUser } from '@/utils/getCurrentUser'
import MiddlewareStatus from '@models/routing/middlewareStatus'

describe('RequireRole', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.resetModules()
    })

    it('returns notfound for unauthorized role', async () => {
        getCurrentUser.mockResolvedValue({
            id: '1234',
            displayName: 'Jane Doe',
            email: 'jane@example.com',
            applicationUserRoles: [
                {
                    role: Role.ModuleAdmin
                }
            ]
        })

        let middleware = new RequireRole([Role.Student])
        let result = await middleware.handle({})

        expect(result.status).toBe(MiddlewareStatus.NotFound)
    })

    it('returns notfound when user has no role', async () => {
        getCurrentUser.mockResolvedValue({
            id: '1234',
            displayName: 'Jane Doe',
            email: 'jane@example.com'
        })

        let middleware = new RequireRole([Role.Student])
        let result = await middleware.handle({})

        expect(result.status).toBe(MiddlewareStatus.NotFound)
    })

    it('returns success when user has specified role', async () => {
        getCurrentUser.mockResolvedValue({
            id: '1234',
            displayName: 'Jane Doe',
            email: 'jane@example.com',
            applicationUserRoles: [
                {
                    role: Role.Student
                }
            ]
        })

        let middleware = new RequireRole([Role.Student])
        let result = await middleware.handle({})

        expect(result.status).toBe(MiddlewareStatus.Success)
    })

    it('returns success when user has multiple roles with a match', async () => {
        getCurrentUser.mockResolvedValue({
            id: '1234',
            displayName: 'Jane Doe',
            email: 'jane@example.com',
            applicationUserRoles: [
                {
                    role: Role.Student
                },
                {
                    role: Role.ModuleAdmin
                }
            ]
        })

        let middleware = new RequireRole([Role.ModuleAdmin])
        let result = await middleware.handle({})

        expect(result.status).toBe(MiddlewareStatus.Success)
    })
})