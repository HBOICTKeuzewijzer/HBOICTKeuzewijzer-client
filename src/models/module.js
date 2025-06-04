import { Category } from "@models"

/**
 * @typedef {Object} ModuleParams
 * @property {string} id - Unique identifier (GUID) of the module.
 * @property {string} name - The display name of the module.
 * @property {string} code - Internal code identifying the module.
 * @property {number} ecs - Number of ECTS credits awarded for the module.
 * @property {string | undefined} description - Optional textual description of the module.
 * @property {Category} category - Normalized category string (one of the predefined constants).
 * @property {Oer} oer - Open Educational Resources metadata associated with the module.
 */

/**
 * Represents an educational module with metadata and category normalization.
 */
export class Module {
    /** @type {string} */
    _id
    /** @type {string} */
    _name
    /** @type {string} */
    _code
    /** @type {number} */
    _ecs
    /** @type {string | undefined} */
    _description
    /** @type {Category} */
    _category
    /** @type {Oer} */
    _oer
    /** @type {boolean} */
    _required
    /** @type {number} */
    _requiredSemester

    /**
     * Constructs a Module instance.
     * @param {ModuleParams} params - The module parameters.
     */
    constructor(params = {}) {
        if (params.id) this.id = params.id
        if (params.name) this.name = params.name
        if (params.code) this.code = params.code
        if (params.eCs) this.ecs = params.eCs
        if (params.description) this.description = params.description
        if (params.category) this.category = new Category(params.category)
        if (params.required) this.required = Boolean(params.required)
        if (params.requiredSemester) this.requiredSemester = Number(params.requiredSemester)
        //if (params.oer) this.oer = params.oer
        //TODO: Uncomment above when these models have been made
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
    get code() {
        return this._code
    }

    /** @param {string} value */
    set code(value) {
        this._code = value
    }

    /** @returns {number} */
    get ecs() {
        return this._ecs
    }

    /** @param {number} value */
    set ecs(value) {
        this._ecs = value
    }

    /** @returns {string | undefined} */
    get description() {
        return this._description
    }

    /** @param {string | undefined} value */
    set description(value) {
        this._description = value
    }

    /** @returns {Category} */
    get category() {
        return this._category
    }

    /** @param {Category} value */
    set category(value) {
        this._category = value
    }

    /** @returns {Oer} */
    get oer() {
        return this._oer
    }

    /** @param {Oer} value */
    set oer(value) {
        this._oer = value
    }

    /** @returns {boolean} */
    get required() {
        return this._required
    }

    /** @param {boolean} value */
    set required(value) {
        this._required = value
    }

    /** @returns {number} */
    get requiredSemester() {
        return this._requiredSemester
    }

    /** @param {number} value */
    set requiredSemester(value) {
        this._requiredSemester = value
    }
}
