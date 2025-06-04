/**
 * @typedef {Object} CustomModuleParams
 * @property {string} id - Unique identifier (GUID) of the customModule.
 * @property {string} name - The display name of the customModule.
 * @property {string | undefined} description - Optional textual description of the customModule.
 * @property {number} ec - Number of ECTS credits awarded for the customModule.
 * @property {number | null} semester - Semester of the customModule.
 * @property {boolean} custom - To differentiate between normal and custom modules.
 */

export class CustomModule {
    /** @type {string} */
    _id
    /** @type {string} */
    _name
    /** @type {string | undefined} */
    _description
    /** @type {number} */
    _ec
    /** @type {number | null} */
    _semester
    /** @type {boolean} */
    _isCustom

    /**
    * Constructs a CustomModule instance.
    * @param {CustomModuleParams} params - The customModule parameters.
    */
    constructor(params = {}) {
        if (params.id) this.id = params.id
        if (params.name) this.name = params.name
        if (params.description) this.description = params.description
        if (params.eCs) this.ec = params.eCs
        if (params.semester) this.semester = params.semester
        this.isCustom = params.isCustom ?? true
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

    /** @returns {string | undefined} */
    get description() {
        return this._description
    }

    /** @param {string | undefined} value */
    set description(value) {
        this._description = value
    }

    /** @returns {number} */
    get ec() {
        return this._ec
    }

    /** @param {number} value */
    set ec(value) {
        this._ec = value
    }

    /** @returns {number | null} */
    get semester() {
        return this._semester
    }

    /** @param {number | null} value */
    set semester(value) {
        this._semester = value
    }

    /** @returns {boolean} */
    get isCustom() {
        return this._isCustom
    }

    /** @param {boolean} value */
    set isCustom(value) {
        this._isCustom = value
    }

    /** @returns {string} JSON string */
    toJson() {
        return {
            name: this.name,
            description: this.description,
            ec: this.ec,
            semester: this.semester
        }
    }
}
