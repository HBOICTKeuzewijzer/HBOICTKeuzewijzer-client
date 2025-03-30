import { Middleware } from '@/http/middleware'

export class MiddlewarePipeline {
    constructor() {}

    async execute() {
        return true
    }
}
