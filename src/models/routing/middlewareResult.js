import MiddlewareStatus from "@models/routing/middlewareStatus";

export class MiddlewareResult {
    /** @type {MiddlewareStatus} */
    #status
    /** @type {string} */
    #redirectLocation

    constructor(status, redirectLocation = null) {
        this.#status = status;
        this.#redirectLocation = redirectLocation;
    }

    get status() {
        return this.#status;
    }

    get redirectLocation() {
        return this.#redirectLocation;
    }

    static success() {
        return new MiddlewareResult(MiddlewareStatus.Success);
    }

    static notFound() {
        return new MiddlewareResult(MiddlewareStatus.NotFound);
    }

    static redirect(location) {
        return new MiddlewareResult(MiddlewareStatus.Redirect, location);
    }
}