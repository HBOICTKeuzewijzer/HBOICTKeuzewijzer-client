/** @typedef {import('@/components').Datatable} Datatable */

import { router } from '@/http/router';
import { DatatableButtons, DatatableColumn, DatatableConfig } from '@/models';
import { fetcher } from '@/utils';

export default function ModulesPage() {
    return /*html*/ `
        <style>
            #table-div {
                padding: 24px;
                width: 95%;
                margin: 0 auto;
            }

            .page-container {
                display: flex;
                background-color: white;
                flex-grow: 1;
                overflow-y: auto;
            }

            #sidebar {
                display: none;
                flex-grow: 1;
            }

            @media (min-width: 640px) {
                #table-div {
                    width: 80%
                }

                #sidebar {
                    display: unset;
                }
            }
        </style>

        <div class="page-container">
            <x-sidebar id="sidebar"></x-sidebar>
            <div id="table-div">
                <x-data-table>
                    <i class="ph ph-magnifying-glass" slot="input-icon"></i>
                    <i class="ph ph-caret-right" slot="forward-icon"></i>
                    <i class="ph ph-caret-double-right" slot="to-end-icon"></i>
                    <i class="ph ph-caret-left" slot="back-icon"></i>
                    <i class="ph ph-caret-double-left" slot="to-start-icon"></i>
                </x-data-table>
            </div>
        </div>

        <x-dialog id="confirmDeleteDialog">
            <div>
                <h2>Weet je zeker dat je dit wil deleten?</h2>
                <br>
                <button id="confirmYes">Yes, delete</button>
                <button id="confirmNo">Cancel</button>
            </div>
        </x-dialog>
    `
}

ModulesPage.onPageLoaded = () => {
    /** @type {Datatable} */
    const table = document.querySelector("x-data-table");
    const dialog = document.querySelector("#confirmDeleteDialog");
    const yesBtn = dialog.shadowRoot?.host.querySelector("#confirmYes");
    const noBtn = dialog.shadowRoot?.host.querySelector("#confirmNo");

    let currentRow = null;

    const yesCallback = async () => {
        if (!currentRow) return;

        dialog.removeAttribute("open");
        await fetcher(`modules/${currentRow.id}`, { method: "delete" });

        currentRow = null;
    };

    const noCallback = () => {
        dialog.removeAttribute("open");
        currentRow = null;
    };

    yesBtn?.addEventListener("click", yesCallback);
    noBtn?.addEventListener("click", noCallback);

    table.dataTable(new DatatableConfig({
        route: "module",
        columns: [
            new DatatableColumn({ path: "id", title: "Id", sorting: true }),
            new DatatableColumn({ path: "name", title: "Naam", sorting: true }),
            new DatatableColumn({ path: "category.value", title: "Categorie", sorting: true }),
            new DatatableColumn({ path: "eCs", title: "Credits" }),
            new DatatableColumn({ path: "level", title: "Niveau", sorting: true }),
            new DatatableColumn({ path: "oer.academicYear", title: "Jaar", sorting: true })
        ],
        searching: true,
        paging: true,
        pageSize: 10,
        buttons: new DatatableButtons({
            edit: (row) => {
                router.navigate(`/admin/modules/edit/${row.id}`);
            },
            delete: (row) => {
                currentRow = row;
                dialog.setAttribute("open", "");
            },
            inspect: (row) => {
                router.navigate(`/admin/modules/inspect/${row.id}`);
            },
        })
    }));
};

ModulesPage.onBeforePageUnloaded = () => {
    console.log("page unloaded");
};
