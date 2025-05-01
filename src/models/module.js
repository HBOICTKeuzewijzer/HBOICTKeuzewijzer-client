/**
 * @typedef {Object} ModuleParams
 * @property {string} id - GUID of the Module.
 * @property {string} name - The name of the module.
 * @property {string} category - The raw category input (e.g., 'software', 'business').
 * @property {string} [description] - Optional description of the module.
 */

/**
 * Represents an educational module with metadata and category normalization.
 */
export class Module {
    static CATEGORY_SOFTWARE = 'SE'
    static CATEGORY_INFRASTRUCTURE = 'IDS'
    static CATEGORY_BUSINESS = 'BIM'
    static CATEGORY_REMAINDER = 'OVERIG'

    /** @type {string} */
    _id
    /** @type {string} */
    _name
    /** @type {string} */
    _category
    /** @type {string | undefined} */
    _description

    /**
     * Constructs a Module instance.
     * @param {ModuleParams} params - The module parameters.
     */
    constructor(params = {}) {
        if (params.id) this.id = params.id
        if (params.name) this.name = params.name
        if (params.category) this.category = params.category
        if (params.description) this.description = params.description
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
    get name() {
        return this._name
    }

    /** @param {string} value */
    set name(value) {
        this._name = value
    }

    /** @returns {string} */
    get category() {
        return this._category
    }

    /** @param {string} value */
    set category(value) {
        this._category = this._normalizeCategory(value)
    }

    /** @returns {string | undefined} */
    get description() {
        return this._description
    }

    /** @param {string | undefined} value */
    set description(value) {
        this._description = value
    }

    /**
     * Converts a free-form category string into a normalized category constant.
     * @private
     * @param {string} value
     * @returns {string}
     */
    _normalizeCategory(value = '') {
        const normalized = value.trim().toLowerCase()

        if (normalized.includes('software')) return Module.CATEGORY_SOFTWARE
        if (normalized.includes('infrastructure') || normalized.includes('security'))
            return Module.CATEGORY_INFRASTRUCTURE
        if (normalized.includes('business')) return Module.CATEGORY_BUSINESS

        return Module.CATEGORY_REMAINDER
    }
}
