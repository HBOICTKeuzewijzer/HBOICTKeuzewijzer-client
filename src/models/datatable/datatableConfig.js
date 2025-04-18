/** @typedef {import('./datatableColumn').DatatableColumn} DatatableColumn */
/** @typedef {import('./datatableButtons').DatatableButtons} DatatableButtons */


export class DatatableConfig {
    #route;
    #columns;
    #searching;
    #paging;
    #pageSize;
    #buttons;

    /**
     * @param {Object} options
     * @param {string} options.route Url to a datasource like a rest api.
     * @param {DatatableColumn[]} options.columns Columns configuration.
     * @param {boolean=} options.searching Enables/disables searching.
     * @param {boolean=} options.paging Enables/disables paging.
     * @param {number=} options.pageSize Sets default page size if paging is enabled.
     * @param {DatatableButtons=} options.buttons Optional button callbacks for actions.
     */
    constructor({
        route,
        columns,
        searching = true,
        paging = true,
        pageSize = 10,
        buttons
    }) {
        this.#route = route;
        this.#columns = columns;
        this.#searching = searching;
        this.#paging = paging;
        this.#pageSize = pageSize;
        this.#buttons = buttons;
    }

    get route() {
        return this.#route;
    }

    get columns() {
        return this.#columns;
    }

    get searching() {
        return this.#searching;
    }

    get paging() {
        return this.#paging;
    }

    get pageSize() {
        return this.#pageSize;
    }

    get buttons() {
        return this.#buttons;
    }
}
