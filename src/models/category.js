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
    /** @type {string} */
    _primaryColor
    /** @type {string} */
    _accentColor
    /** @type {number} */
    _position

    /**
     * Constructs a category class
     * @param {CategoryParams} params
     */
    constructor(params = {}) {
        if (params.id) this.id = params.id
        if (params.value) this.value = params.value
        if (params.primaryColor) this.primaryColor = params.primaryColor
        if (params.position) this.position = params.position
        if (params.accentColor) this.accentColor = params.accentColor
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

    /** @returns {string} */
    get primaryColor() {
        return this._primaryColor
    }

    /** @param {string} value */
    set primaryColor(value) {
        this._primaryColor = value
    }

    /** @returns {string} */
    get accentColor() {
        return this._accentColor
    }

    /** @param {string} value */
    set accentColor(value) {
        this._accentColor = value
    }

    /** @returns {number} */
    get position() {
        return this._position
    }

    /** @param {number} value */
    set position(value) {
        this._position = value
    }
}