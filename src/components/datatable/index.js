/** @typedef {import('@models/datatable/datatableConfig').DatatableConfig} DatatableConfig */

import { html, resolvePath } from "@/utils/functions";
import CustomElement from "@components/customElement";
import { fetcher } from "@/utils";
import styles from "./styles.css?raw"

const template = html`
<style>${styles}</style>
<div class="container">
    <div id="searchbar-container">
        <div class="searchbar-sizer">
            <x-input placeholder="Zoeken" id="src">
                <slot name="input-icon" slot="prepend"></slot>
            </x-input>
        </div>
    </div>
    <div class="table-container">
        <table>
            <thead><tr></tr></thead>
            <tbody></tbody>
        </table>
    </div>
    <div class="table-footer-container">
        <div class="text-container">
            <p>Totaal <span id="amount-of-records"></span></p>
        </div>
        <div class="paging-container">
            <div class="text-container">
                <p>Pagina <span id="current-page"></span> van <span id="total-pages"></span></p>
            </div>

            <div class="button-container">
                <button name="to-start">
                    <slot name="to-start-icon"></slot>
                </button>
                <button name="back">
                    <slot name="back-icon"></slot>
                </button>
                <button name="forward">
                    <slot name="forward-icon"></slot>
                </button>
                <button name="to-end">
                    <slot name="to-end-icon"></slot>
                </button>
            </div>
        </div>
    </div>
</div>
`;

/**
 * Datatable that builds itself based on config given and data received from the api.
 * Requires the api endpoint to be a GET that returns a model in this form:
 * {    
 *      items: [],
 *      totalCount: int, // total amount of available items.
 * }
 * 
 * Also requires the api endpoint to accept the following query parameters:
 * '?filter=&sortColumn=&sortDirection=ASC,DESC&page=&pageSize='
 * Paging, sorting and filtering can all be disabled in which case none of these parameters need to be supported.
 */
export class Datatable extends CustomElement {
    static get observedAttributes() {
        return [];
    }

    /**
     * @type {DatatableConfig}
     */
    #config = null;

    /**
     * Collection of svg html strings copied from https://phosphoricons.com/
     * @type {string[]}
     */
    #svgIcons = {
        edit: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path></svg>`,
        delete: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>`,
        inspect: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path></svg>`
    };

    #queryState = {
        page: 1,
        filter: "",
        sortColumn: "",
        sortDirection: ""
    };

    #totalAmountOfRecords;

    #pageCount;

    constructor() {
        super();
    }

    connectedCallback() {
        this.applyTemplate(template);
    }

    disconnectedCallback() {
        this.clearListeners();
    }

    /**
     * Sets the table up with the config options from provided config object.
     * @param {DatatableConfig} config 
     */
    dataTable(config) {
        this.#config = config;
        this.#validateConfig();
        this.#loadQueryParams();
        this.#updateQueryParams();
        this.#constructTable();
        this.#loadTable();
    }

    #validateConfig() {
        if (!this.#config) {
            throw new Error("No config was provided for datatable.");
        }

        if (!this.#config.route) {
            throw new Error("No route provided for datatable.");
        }

        if (!this.#config.columns) {
            throw new Error("No column defitions provided for datatable.");
        }

        for (let i = 0; i < this.#config.columns.length; i++) {
            const col = this.#config.columns[i];

            if (!col.path) {
                throw new Error(`No path provided for column [${i}]`);
            }
        }
    }

    #constructTable() {
        const tableHeader = this.root.querySelector("thead tr");

        this.#config.columns.forEach(col => {
            let title = col.title ? col.title : col.path;

            let th = document.createElement("th");
            th.textContent = title;

            tableHeader.appendChild(th);
        });

        if (this.#config.buttons) {
            const th = document.createElement("th");
            th.classList.add('button-column');
            tableHeader.appendChild(th);
        }

        const searchbarContainer = this.root.querySelector("#searchbar-container");
        if (this.#config.searching) {
            const searchbar = searchbarContainer.querySelector("x-input");
            this.trackListener(searchbar, "onValueChanged", event => this.#onSearch(event));
            searchbar.value = this.#queryState.filter;
        } else {
            searchbarContainer.style.display = "none";
        }

        const pagingContainer = this.root.querySelector(".paging-container");
        if (this.#config.paging) {
            pagingContainer.style.display = "";
            pagingContainer.querySelectorAll("button").forEach(button => this.trackListener(button, "click", event => this.#onPaging(event)));
        } else {
            pagingContainer.style.display = "none";
        }
    }

    #loadQueryParams() {
        const url = new URL(window.location.href);
        const params = url.searchParams;

        for (const key in this.#queryState) {
            const value = params.get(key);

            if (value !== null) {
                if (key === "currentPage" || key === "pageSize") {
                    this.#queryState[key] = parseInt(value, 10);
                } else {
                    this.#queryState[key] = value;
                }
            }
        }
    }

    #updateQueryParams() {
        const url = new URL(window.location.href);
        const queryState = this.#queryState;

        for (const param in queryState) {
            const value = queryState[param];

            if (value !== "" && value != null) {
                url.searchParams.set(param, value);
            } else {
                url.searchParams.delete(param);
            }
        }

        window.history.replaceState({}, "", url.toString());
    }

    /**
     * Gets data with the url plus the querystate.
     * @returns {Object} Data from api.
     */
    async #getData() {
        const params = new URLSearchParams({
            filter: this.#queryState.filter,
            sortColumn: this.#queryState.sortColumn,
            sortDirection: this.#queryState.sortDirection,
            page: this.#queryState.page,
            pageSize: this.#config.pageSize,
        });

        const url = `${this.#config.route}?${params.toString()}`;

        return await fetcher(url, { method: "get" });
    }

    /**
     * Starts setting up the table with data gotten from an endpoint.
     */
    async #loadTable() {
        try {
            const data = await this.#getData();

            const tbody = this.root.querySelector("tbody");

            tbody.innerHTML = '';

            this.#totalAmountOfRecords = Number(data.totalCount);
            this.#pageCount = Math.ceil(this.#totalAmountOfRecords / this.#config.pageSize);


            // <p>Pagina <span id="current-page"></span> van <span id="total-pages"></span></p>

            const curPageEl = this.root.querySelector("#current-page");
            curPageEl.innerHTML = this.#queryState.page;
            const totalPageEl = this.root.querySelector("#total-pages");
            totalPageEl.innerHTML = this.#pageCount;

            this.root.querySelector("#amount-of-records").innerHTML = this.#totalAmountOfRecords;

            data.items.forEach(record => {
                const tr = document.createElement("tr");

                this.#config.columns.forEach(col => {
                    const td = document.createElement("td");
                    const rawValue = resolvePath(record, col.path);
                    const value = col.render ? col.render(rawValue, record) : rawValue;
                    td.innerHTML = value != null ? value : "";
                    tr.appendChild(td);
                });

                const buttons = this.#config.buttons?.toObject?.();

                if (buttons) {
                    const td = document.createElement("td");
                    td.classList.add('button-column')

                    for (const [button, callback] of Object.entries(buttons)) {
                        if (button === "create") continue;

                        const btn = document.createElement("button");
                        btn.setAttribute("data-action", button);
                        btn.innerHTML = this.#svgIcons[button];

                        this.trackListener(btn, "click", () => {
                            if (typeof callback === "function") {
                                callback(record);
                            }
                        });

                        td.appendChild(btn);
                    }

                    tr.appendChild(td);
                }

                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error("Error loading table data:", error);
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
    }

    #onSearch(event) {
        this.#queryState.filter = event.detail.query;
        this.#updateQueryParams();
        this.#loadTable();
    }

    #onPaging(event) {
        const name = event.currentTarget.name;

        switch (name) {
            case "to-start":
                this.#queryState.page = 1;
                break;
            case "to-end":
                this.#queryState.page = this.#pageCount;
                break;
            case "forward":
                if (this.#queryState.page < this.#pageCount) {
                    this.#queryState.page++;
                }
                break;
            case "back":
                if (this.#queryState.page > 1) {
                    this.#queryState.page--;
                }
                break;
            default:
                throw new Error("Not an expected button.");
        }

        this.#updateQueryParams();
        this.#loadTable();
    }
}
