import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { User } from '@/models'
import Role from '@models/role'

vi.mock('@utils/auth', () => ({
    Auth: {
        getUser: vi.fn(() => {
            return new User({
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
        })
    }
}))

// Apperently needed
import { routes } from '@/routes'
import { RequireRole } from '@/http/middleware'
import MiddlewareStatus from '@models/routing/middlewareStatus'

describe('RequireRole', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.resetModules()
    })

    it('returns notfound for unauthorized role', async () => {
        let middleware = new RequireRole([Role.Student])
        let result = await middleware.handle({})

        expect(result.status).toBe(MiddlewareStatus.NotFound)
    })

    it('returns notfound when user has no role', async () => {
        let middleware = new RequireRole([Role.Student])
        let result = await middleware.handle({})

        expect(result.status).toBe(MiddlewareStatus.NotFound)
    })

    it('returns success when user has specified role', async () => {
        let middleware = new RequireRole([Role.ModuleAdmin])
        let result = await middleware.handle({})

        expect(result.status).toBe(MiddlewareStatus.Success)
    })

    it('returns success when user has multiple roles with a match', async () => {
        let middleware = new RequireRole([Role.SystemAdmin])
        let result = await middleware.handle({})

        expect(result.status).toBe(MiddlewareStatus.Success)
    })
})