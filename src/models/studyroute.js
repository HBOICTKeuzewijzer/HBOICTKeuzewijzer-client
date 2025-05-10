import { Semester } from "./semester"

export class StudyRoute {
    /** @type {string} */
    _id
    /** @type {string} */
    _displayName
    /** @type {Semester[]} */
    _semesters

    /**
     * @param {Object} params
     */
    constructor(params = {}) {
        if (params.id) this._id = params.id
        if (params.displayName) this._displayName = params.displayName
        if (params.semesters) this._semesters = params.semesters.map(s => new Semester(s))
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
    get displayName() {
        return this._displayName
    }

    /** @param {string} value */
    set displayName(value) {
        this._displayName = value
    }

    /** @returns {Semester[]} */
    get semesters() {
        return this._semesters
    }

    /** @param {Semester[]} value */
    set semesters(value) {
        this._semesters = value
    }

    /** @type {string} json string */
    toJson() {
        return {
            id: this.id,
            displayName: this.displayName,
            semesters: this.semesters ? this.semesters.map(s => s.toJson()) : []
        }
    }
}
