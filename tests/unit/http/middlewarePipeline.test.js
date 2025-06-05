import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Middleware and SetAuthCookie classes as dummy classes
vi.mock('@/http/middleware', () => ({
    Middleware: class { },
    SetAuthCookie: class {
        async handle() { return { status: 'success' } }
    }
}))

import { MiddlewarePipeline } from '@http/middlewarePipeline'
import { Middleware } from '@http/middleware'
import MiddlewareStatus from '@models/routing/middlewareStatus'
import { MiddlewareResult } from '@/models'

// DummyMiddleware class with mocked handle function
class DummyMiddleware extends Middleware {
    handle = vi.fn()
}

describe('MiddlewarePipeline', () => {
    let context

    beforeEach(() => {
        context = { some: 'context' }
    })

    it('throws if middlewares is not an array', async () => {
        await expect(MiddlewarePipeline.run(null, context)).rejects.toThrow('[MiddlewarePipeline] Middlewares must be an array')
    })

    it('skips non-Middleware instances', async () => {
        // Arrange
        const middleware = new DummyMiddleware()
        middleware.handle.mockResolvedValue(MiddlewareResult.success())

        // Act
        const result = await MiddlewarePipeline.run([middleware, {}], context)

        // Assert
        expect(middleware.handle).toHaveBeenCalledOnce()
        expect(result).toEqual(MiddlewareResult.success())
    })

    it('runs all middlewares that succeed', async () => {
        // Arrange
        const middleware1 = new DummyMiddleware()
        const middleware2 = new DummyMiddleware()
        middleware1.handle.mockResolvedValue(MiddlewareResult.success())
        middleware2.handle.mockResolvedValue(MiddlewareResult.success())

        // Act
        const result = await MiddlewarePipeline.run([middleware1, middleware2], context)

        // Assert
        expect(middleware1.handle).toHaveBeenCalledWith(context)
        expect(middleware2.handle).toHaveBeenCalledWith(context)
        expect(result).toEqual(MiddlewareResult.success())
    })

    it('returns immediately if middleware returns failure', async () => {
        // Arrange
        const middleware1 = new DummyMiddleware()
        const middleware2 = new DummyMiddleware()
        const failResult = new MiddlewareResult(MiddlewareStatus.NotFound)

        middleware1.handle.mockResolvedValue(MiddlewareResult.success())
        middleware2.handle.mockResolvedValue(failResult)

        // Act
        const result = await MiddlewarePipeline.run([middleware1, middleware2], context)

        // Assert
        expect(middleware1.handle).toHaveBeenCalled()
        expect(middleware2.handle).toHaveBeenCalled()
        expect(result).toBe(failResult)
    })

    it('returns false and logs error if middleware throws', async () => {
        // Arrange
        const middleware = new DummyMiddleware()
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

        middleware.handle.mockRejectedValue(new Error('fail'))

        // Act
        const result = await MiddlewarePipeline.run([middleware], context)

        // Assert
        expect(result).toBe(false)
        expect(consoleSpy).toHaveBeenCalledWith('[MiddlewarePipeline] Error in middleware:', expect.any(Error))

        consoleSpy.mockRestore()
    })
})
