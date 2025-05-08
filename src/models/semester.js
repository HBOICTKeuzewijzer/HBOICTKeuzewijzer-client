import { Module } from "./module"
import { StudyRoute } from "./studyroute"

export class Semester {
    /** @type {string} */
    _id
    /** @type {string} */
    _index
    /** @type {number} */
    _acquiredEcs
    /** @type {string} */
    _moduleId
    /** @type {Module} */
    _module
    /** @type {string} */
    _studyRouteId
    /** @type {StudyRoute} */
    _studyRoute

    /**
     * @param {Object} params
     */
    constructor(params = {}) {
        if (params.id) this.id = params.id
        if (params.index || params.index === 0) this.index = params.index
        if (params.acquiredEcs) this.acquiredEcs = params.acquiredEcs
        if (params.moduleId) this.moduleId = params.moduleId
        if (params.module) this.module = new Module(params.module)
        if (params.studyRouteId) this.studyRouteId = params.studyRouteId
        if (params.studyRoute) this.studyRoute = new StudyRoute(params.studyRoute)
    }

    /** @returns {string} */
    get id() {
        return this._id
    }

    /** @param {string} value */
    set id(value) {
        this._id = value
    }

    /** @returns {number} */
    get index() {
        return this._index
    }

    /** @param {number} value */
    set index(value) {
        this._index = value
    }

    /** @returns {string} */
    get acquiredEcs() {
        return this._acquiredEcs
    }

    /** @param {string} value */
    set acquiredEcs(value) {
        this._acquiredEcs = value
    }

    /** @returns {string} */
    get moduleId() {
        return this._moduleId
    }

    /** @param {string} value */
    set moduleId(value) {
        this._moduleId = value
    }

    /** @returns {Module} */
    get module() {
        return this._module
    }

    /** @param {Module} value */
    set module(value) {
        this._module = value
    }

    /** @returns {string} */
    get studyRouteId() {
        return this._studyRouteId
    }

    /** @param {string} value */
    set studyRouteId(value) {
        this._studyRouteId = value
    }

    /** @returns {StudyRoute} */
    get studyRoute() {
        return this._studyRoute
    }

    /** @param {StudyRoute} value */
    set studyRoute(value) {
        this._studyRoute = value
    }
}
