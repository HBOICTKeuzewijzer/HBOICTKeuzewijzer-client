/** @typedef {import('@/components').Datatable} Datatable */

import { DatatableButtons, DatatableColumn, DatatableConfig } from '@/models'
import { fetcher } from '@/utils'
import { router } from '@/http/router'

export default function OerPage() {
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
            <h1 slot="title">Oeren beheren</h1>
            <p slot="subtitle">Bekijk hier een overzicht van alle oeren. Hier kan je oeren toevoegen en verwijderen</p>
            <button id="add-button">Oer toevoegen</button>
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

OerPage.onPageLoaded = () => {
    document.querySelector('#add-button').addEventListener('click', addOnClick)

    try {
        /** @type {Datatable} */
        const table = document.querySelector('x-data-table')
        const dialog = document.querySelector('#confirmDeleteDialog')
        const yesBtn = dialog.shadowRoot?.host.querySelector('#confirmYes')
        const noBtn = dialog.shadowRoot?.host.querySelector('#confirmNo')

        let currentRow = null

        const yesCallback = async () => {
            if (!currentRow) return

            dialog.removeAttribute('open')
            await fetcher(`oer/${currentRow.id}`, { method: 'delete' })

            currentRow = null
        }

        const noCallback = () => {
            dialog.removeAttribute('open')
            currentRow = null
        }

        yesBtn?.addEventListener('click', yesCallback)
        noBtn?.addEventListener('click', noCallback)

        table.dataTable(
            new DatatableConfig({
                route: 'oer',
                columns: [
                    new DatatableColumn({ path: 'id', title: 'Id', sorting: true }),
                    new DatatableColumn({ path: 'academicYear', title: 'Jaar', sorting: true }),
                    new DatatableColumn({ path: 'filePath', title: 'File' }),
                ],
                searching: true,
                paging: true,
                pageSize: 10,
                buttons: new DatatableButtons({
                    edit: row => {
                        router.navigate(`/admin/oer/edit/${row.id}`)
                    },
                    delete: row => {
                        currentRow = row
                        dialog.setAttribute('open', '')
                    },
                    inspect: row => {
                        router.navigate(`/admin/oer/inspect/${row.id}`)
                    },
                }),
            }),
        )
    } catch (error) {
        console.log(error)
    }
}

function addOnClick() {
    router.navigate('/admin/oer/create')
}

OerPage.onBeforePageUnloaded = () => {
    document.querySelector('#add-button').removeEventListener('click', addOnClick)
}
