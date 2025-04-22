/** @typedef {import('@/components').Datatable} Datatable */

import { DatatableButtons, DatatableColumn, DatatableConfig } from '@/models';

export default function ModulesPage() {
    return /*html*/ `

        <style>
            /* General container styles */
            #module-div {
                width: 95%;
            }

            /* Center the table container */
            .page-container {
                display: flex;
                justify-content: center;
                padding-top: 24px;
                background-color: white;
                flex-grow: 1;
                overflow-y: auto;
            }

            @media (min-width: 640px) {
                #module-div {
                    width: 80%;
                }
            }
        </style>

        <div class="page-container">
            <x-sidebar></x-sidebar>
            <div id="module-div">
                <x-data-table>
                    <i class="ph ph-magnifying-glass" slot="input-icon"></i>
                    <i class="ph ph-caret-right" slot="forward-icon"></i>
                    <i class="ph ph-caret-double-right" slot="to-end-icon"></i>
                    <i class="ph ph-caret-left" slot="back-icon"></i>
                    <i class="ph ph-caret-double-left" slot="to-start-icon"></i>
                </x-data-table>
            </div>
        </div>
    `
}

ModulesPage.onPageLoaded = () => {
    /** @type {Datatable} */
    const table = (document.querySelector("#module-div x-data-table"));

    table.dataTable(new DatatableConfig({
        route: "module",
        columns: [
            new DatatableColumn({ path: "id", title: "Id", sorting: true }),
            new DatatableColumn({ path: "name", title: "Naam", sorting: true }),
            new DatatableColumn({ path: "category", title: "Categorie", sorting: true }),
            new DatatableColumn({ path: "eCs", title: "Credits" }),
            new DatatableColumn({
                path: "enabled", title: "Status", render: function (data) {
                    return data ? "enabled" : "disabled";
                }
            }),
        ],
        searching: true, // TODO: test false
        paging: true, // TODO: test false, viel me al op dat met false nog steeds maar 10 records laat zien.
        pageSize: 10,
        buttons: new DatatableButtons({
            edit: (row) => console.log("Editing:", row),
            delete: (row) => console.log("Deleting:", row),
            inspect: (row) => console.log("Inspecting:", row),
        })
    }));
};

ModulesPage.onBeforePageUnloaded = () => {
    console.log("page unloaded");
};
