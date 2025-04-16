import { html } from "@/utils/functions";
import CustomElement from "@components/customElement";
import { fetcher } from "@/utils";

/**
 * @typedef {Object} DatatableButtons
 * @property {function(Object): void=} edit - Called when edit button is pressed with row data.
 * @property {function(Object): void=} delete - Called when delete button is pressed with row data.
 * @property {function(Object): void=} inspect - Called when inspect button is pressed with row data.
 * @property {function(): void=} create - Called when create button is pressed (no row context).
 */

/**
 * @typedef DatatableColumn 
 * @property {string} path Path to the field in received data.
 * @property {string=} title Column header title, if left out will take path as value.
 * @property {boolean=} sorting Enables or disables sorting button on column header.
 * @property {Function=} render Method to modify data for that column bool > string value for example.
 */

/**
 * @typedef DatatableConfig
 * @property {string} route Url to a datasource like a rest api.
 * @property {DatatableColumn[]} columns Configure columns.
 * @property {boolean=} searching Enables/disables searching.
 * @property {boolean=} paging Enables/disables paging.
 * @property {boolean=} pageSize Sets default page size if paging is enabled.
 * @property {DatatableButtons=} buttons - Optional button callbacks for actions.
 */

const template = html`
<div id="header-container">
    <div id="header-content">
        <h1 id="header-heading"></h1>
        <p id="header-description"></p>
    </div>
</div>
<div id="searchbar-container"></div>
<table>
    <caption></caption>
    <thead><tr></tr></thead>
    <tbody></tbody>
</table>
<div id="paging-container"></div>
`;

const captionKey = 'caption';

export class Datatable extends CustomElement {
    static get observedAttributes() {
        return [captionKey];
    }

    /**
     * @type {DatatableConfig}
     */
    #config = null;

    constructor() {
        super();
    }

    /**
     * Set the caption.
     * @param {string} caption
     */
    set caption(caption) {
        this.setAttribute(captionKey, caption);
    }

    /**
     * Get the caption.
     * @returns {string} Caption value.
     */
    get caption() {
        return this.getAttribute(captionKey);
    }

    get root() {
        return this.shadowRoot;
    }

    connectedCallback() {
        this.applyTemplate(template);

        this.root.querySelector("caption").innerHTML = this.caption;
    }

    /**
     * Sets the table up with the config options from provided config object.
     * @param {DatatableConfig} config 
     */
    dataTable(config) {
        this.#config = config;
        this.#validateConfig();
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
            throw new Error("No column defitions provided for datatable.")
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
            th.setAttribute("data-action-column", "true");
            tableHeader.appendChild(th);
        }

        if (this.#config.searching) {
            this.root.querySelector("#searchbar-container").innerHTML = /*html*/`<x-input placeholder="Zoeken"></x-input>`;
        }
    }


    #svgIcons = {
        edit: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM51.31,160,136,75.31,152.69,92,68,176.68ZM48,179.31,76.69,208H48Zm48,25.38L79.31,188,164,103.31,180.69,120Zm96-96L147.31,64l24-24L216,84.68Z"></path></svg>`,
        delete: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>`,
        inspect: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path></svg>`
    }


    /**
     * Starts setting up the table with data gotten from an endpoint.
     */
    async #loadTable() {
        try {
            const data = await fetcher(this.#config.route, { method: "get" });

            const tbody = this.root.querySelector("tbody");

            tbody.innerHTML = '';

            data.forEach(record => {
                const tr = document.createElement("tr");

                this.#config.columns.forEach(col => {
                    const td = document.createElement("td");
                    const rawValue = this.#resolvePath(record, col.path);
                    const value = col.render ? col.render(rawValue, record) : rawValue;
                    td.innerHTML = value != null ? value : "";
                    tr.appendChild(td);
                });

                const buttons = this.#config.buttons;
                if (buttons) {
                    const td = document.createElement("td");

                    for (const button in buttons) {
                        if (button === "create") continue;

                        const callback = buttons[button];
                        const btn = document.createElement("button");
                        btn.setAttribute("data-action", button);

                        // TODO: dit mag nog wat anders
                        btn.innerHTML = this.#svgIcons[button];

                        btn.addEventListener("click", () => {
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


    #resolvePath(obj, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
    }
}
