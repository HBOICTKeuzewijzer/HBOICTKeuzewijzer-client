/** @typedef {import('@/components').Datatable} Datatable */

import { DatatableButtons, DatatableColumn, DatatableConfig } from '@/models';
import { router } from '@/http/router';
import { fetcher } from '@/utils';

export default function RoleAssignmentPage() {
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

        <x-page-header>
            <h1 slot="title">Rollen beheren</h1>
            <p slot="subtitle">Bekijk hier een overzicht van alle gebruiker en hun rullen. Hier kan je rollen beheren.</p>
        </x-page-header>

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

RoleAssignmentPage.onPageLoaded = () => {
    /** @type {Datatable} */
    const table = (document.querySelector("x-data-table"));
    const dialog = document.querySelector("#confirmDeleteDialog");
    const yesBtn = dialog.shadowRoot?.host.querySelector("#confirmYes");
    const noBtn = dialog.shadowRoot?.host.querySelector("#confirmNo");

    let currentRow = null;

    const yesCallback = async () => {
        if (!currentRow) return;

        dialog.removeAttribute("open");
        await fetcher(`user/${currentRow.id}`, { method: "delete" });

        currentRow = null;
    };

    const noCallback = () => {
        dialog.removeAttribute("open");
        currentRow = null;
    };

    yesBtn?.addEventListener("click", yesCallback);
    noBtn?.addEventListener("click", noCallback);

    table.dataTable(new DatatableConfig({
        route: "user",
        columns: [
            new DatatableColumn({ path: "id", title: "Id", sorting: true }),
            new DatatableColumn({ path: "email", title: "Email", sorting: true }),
            new DatatableColumn({ path: "displayName", title: "Name" }),
            new DatatableColumn({ path: "code", title: "Code", sorting: true })
        ],
        searching: true,
        paging: true,
        pageSize: 10,
        buttons: new DatatableButtons({
            edit: (row) => {
                router.navigate(`/admin/rollen-toewijzen/edit/${row.id}`);
            }
        })
    }));
}
