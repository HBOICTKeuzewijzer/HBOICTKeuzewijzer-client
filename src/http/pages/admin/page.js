/** @typedef {import('@/components').Datatable} Datatable */

import { DatatableButtons, DatatableColumn, DatatableConfig } from '@/models';

export default function AdminPage() {
    return /*html*/ `
        <div id="admindiv">
            <x-data-table>

            </x-data-table>
        </div>
    `;
}


AdminPage.onPageLoaded = () => {
    /** @type {Datatable} */
    const table = (document.querySelector("#admindiv x-data-table"));

    table.dataTable(new DatatableConfig({
        route: "module",
        columns: [
            new DatatableColumn({ path: "id", title: "Id", sorting: true }),
            new DatatableColumn({ path: "name", title: "Naam", sorting: true }),
            new DatatableColumn({ path: "category", title: "Categorie", sorting: true }),
            new DatatableColumn({ path: "eCs", title: "Credits" }),
            new DatatableColumn({
                path: "enabled", title: "Enabled", render: function (data) {
                    return data ? "enabled" : "disabled";
                }
            }),
        ],
        searching: true,
        paging: true,
        pageSize: 10,
        buttons: new DatatableButtons({
            edit: (row) => console.log("Editing:", row),
            delete: (row) => console.log("Deleting:", row),
            inspect: (row) => console.log("Inspecting:", row),
        })
    }));
};

AdminPage.onBeforePageUnloaded = () => {
    console.log("page unloaded");
};