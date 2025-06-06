export class DatatableButtons {
    #edit
    #delete
    #inspect

    /**
     * @param {Object} [options={}]
     * @param {function(Object): void=} options.edit Called when edit button is pressed with row data.
     * @param {function(Object): void=} options.delete Called when delete button is pressed with row data.
     * @param {function(Object): void=} options.inspect Called when inspect button is pressed with row data.
     */
    constructor({ edit, delete: del, inspect } = {}) {
        this.#edit = edit
        this.#delete = del
        this.#inspect = inspect
    }

    get inspect() {
        return this.#inspect
    }

    get edit() {
        return this.#edit
    }

    get delete() {
        return this.#delete
    }

    toObject() {
        const result = {}
        if (this.#edit) result.edit = this.#edit
        if (this.#delete) result.delete = this.#delete
        if (this.#inspect) result.inspect = this.#inspect
        return result
    }
}
