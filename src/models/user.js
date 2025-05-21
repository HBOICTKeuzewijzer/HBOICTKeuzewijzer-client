/**
 * Represents a user in the system.
 */
export class User {
    /** @type {string|undefined} */
    _id

    /** @type {string|undefined} */
    _displayName

    /** @type {string|undefined} */
    _email

    /** @type {Role[]} */
    _roles

    /**
     * Constructs a new User instance.
     * @param {Object} params - The parameters to initialize the user.
     * @param {string} [params.id] - The user's ID.
     * @param {string} [params.displayName] - The user's full name (e.g. "Alice (student)").
     * @param {string} [params.email] - The user's email address.
     */
    constructor(params = {}) {
        if (params.id) this._id = params.id
        if (params.displayName) this._displayName = params.displayName
        if (params.email) this._email = params.email
        if (params.roles) this._roles = params.roles
        if (params.applicationUserRoles) this._roles = this.parseApplicationUserRoles(params.applicationUserRoles)
    }

    /**
     * Returns the user ID.
     * @returns {string|undefined}
     */
    get id() {
        return this._id
    }

    /**
     * Returns the user's name.
     * @returns {string|undefined}
     */
    get displayName() {
        return this._displayName
    }

    /**
     * Returns the user's email address.
     * @returns {string|undefined}
     */
    get email() {
        return this._email
    }

    /**
     * Returns roles
     * @returns {Role[]}
     */
    get roles() {
        return this._roles
    }

    hasRole(role) {
        return this._roles?.includes(role)
    }

    parseApplicationUserRoles(roles) {
        return roles.map(role => role.role)
    }

    asJson() {
        return {
            id: this.id,
            displayName: this.displayName,
            email: this.email,
            roles: this.roles
        }
    }
}
