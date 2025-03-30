export class Middleware {
    async execute(path, param) {
        throw new Error('execute() must be implemented in the subclass')
    }
}
