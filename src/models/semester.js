import { Module } from "./module"
import { CustomModule } from "./customModule"
import { StudyRoute } from "./studyroute"

export class Semester {
    /** @type {string} */
    _id
    /** @type {string} */
    _index
    /** @type {number} */
    _acquiredECs
    /** @type {string} */
    _moduleId
    /** @type {Module} */
    _module
    /** @type {string} */
    _customModuleId
    /** @type {CustomModule} */
    _customModule
    /** @type {string} */
    _studyRouteId
    /** @type {StudyRoute} */
    _studyRoute

    _errors

    /**
     * @param {Object} params
     */
    constructor(params = {}) {
        if (params.id) this.id = params.id
        if (params.index || params.index === 0) this.index = params.index
        if (params.acquiredECs !== undefined) this.acquiredECs = params.acquiredECs;
        if (params.moduleId) this.moduleId = params.moduleId
        if (params.module) this.module = new Module(params.module)
        if (params.customModuleId) this.customModuleId = params.customModuleId
        if (params.customModule) this.customModule = new CustomModule(params.customModule)
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

    /** @returns {number} */
    get acquiredECs() {
        return this._acquiredECs
    }

    /** @param {number} value */
    set acquiredECs(value) {
        this._acquiredECs = value
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
    get customModuleId() {
        return this._customModuleId
    }

    /** @param {string} value */
    set customModuleId(value) {
        this._customModuleId = value
    }

    /** @returns {CustomModule} */
    get customModule() {
        return this._customModule
    }

    /** @param {CustomModule} value */
    set customModule(value) {
        this._customModule = value
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

    get errors() {
        return this._errors
    }

    set errors(value) {
        this._errors = value
    }

    get errorsText() {
        return this._errors.join('\r\n---------------------\r\n')
    }

    /** @returns {string} JSON string */
    toJson() {
        return {
            id: this.id,
            index: this.index,
            acquiredECs: this.acquiredECs,
            moduleId: this.moduleId,
            customModuleId: this.customModuleId,
            customModule: this.customModule ? this.customModule.toJson() : null,
            studyRouteId: this.studyRouteId,
        }
    }
}
