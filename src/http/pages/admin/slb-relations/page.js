/** @typedef {import('@/components').Datatable} Datatable */

import { DatatableButtons, DatatableColumn, DatatableConfig } from '@/models';

export default function SlbRelationsPage() {
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
    `
}

SlbRelationsPage.onPageLoaded = () => {
    /** @type {Datatable} */
    const table = (document.querySelector("x-data-table"));

    table.dataTable(new DatatableConfig({
        route: "user",
        columns: [
            new DatatableColumn({ path: "id", title: "Id", sorting: true }),
            new DatatableColumn({ path: "slbApplicationUser.name", title: "SLB'er", sorting: true })
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
}
