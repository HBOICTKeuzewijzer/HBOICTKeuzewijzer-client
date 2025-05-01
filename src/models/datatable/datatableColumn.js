export class DatatableColumn {
    #path;
    #title;
    #sorting;
    #render;

    /**
     * @param {Object} options
     * @param {string} options.path Path to the field in received data.
     * @param {string=} options.title Column header title, if left out will take path as value.
     * @param {boolean=} options.sorting Enables or disables sorting button on column header.
     * @param {Function=} options.render Method to modify data for that column bool > string value for example.
     */
    constructor({ path, title = null, sorting = false, render = null }) {
        this.#path = path;
        this.#title = title || path;
        this.#sorting = sorting;
        this.#render = render;
    }

    get path() {
        return this.#path;
    }

    get title() {
        return this.#title;
    }

    get sorting() {
        return this.#sorting;
    }

    get render() {
        return this.#render;
    }
}
