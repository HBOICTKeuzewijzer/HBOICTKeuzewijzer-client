/**
 * Represents a user in the system.
 */
export class User {
    /** @type {string|undefined} */
    _id

    /** @type {string|undefined} */
    _name

    /** @type {string|undefined} */
    _email

    /**
     * Constructs a new User instance.
     * @param {Object} params - The parameters to initialize the user.
     * @param {string} [params.id] - The user's ID.
     * @param {string} [params.name] - The user's full name (e.g. "Alice (student)").
     * @param {string} [params.email] - The user's email address.
     */
    constructor(params) {
        if (params.id) this._id = params.id

        if (params.name) this._name = name

        if (params.email) this._email = params.email
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
    get name() {
        return this._name
    }

    /**
     * Returns the user's email address.
     * @returns {string|undefined}
     */
    get email() {
        return this._email
    }
}
