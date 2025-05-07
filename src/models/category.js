/**
 * @typedef {Object} CategoryParams
 * @property {string} id
 * @property {string} value
 */

export class Category {
    /** @type {string} */
    _id
    /** @type {string} */
    _value

    /**
     * Constructs a category class
     * @param {CategoryParams} params
     */
    constructor(params = {}) {
        if (params.id) this._id = params.id
        if (params.value) this._value = params.value
    }

    /** @returns {string} */
    get id() {
        return this._id
    }

    /** @param {string} value */
    set id(value) {
        this._id = value
    }

    /** @returns {string} */
    get value() {
        return this._value
    }

    /** @param {string} value */
    set value(value) {
        this._value = value
    }
}