/** @typedef {import('@/components').Datatable} Datatable */

import { router } from '@/http/router'
import { DatatableButtons, DatatableColumn, DatatableConfig } from '@/models'
import { fetcher } from '@/utils'

export default function StudyRoutes() {
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
                    width: 80%;
                }

                #sidebar {
                    display: unset;
                }
            }
        </style>

        <x-page-header>
            <h1 slot="title">Studieroutes beheren</h1>
            <p slot="subtitle">Bekijk hier een overzicht van al je studieroutes. Hier kun je nieuwe routes aanmaken. Bestaande routes bekijken en verwijderen.</p>
            <button id="add-button">Studieroute toevoegen</button>
        </x-page-header>

        <div class="page-container">
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
                <button id="confirmYes">Ja, delete</button>
                <button id="confirmNo">Annuleren</button>
            </div>
        </x-dialog>

        <x-dialog id="newStudyRouteDialog" closable>
            <div>
                <h2>Geef je nieuwe route een naam.</h2>
                <br>
                <x-input id="newRouteName" placeholder="Naam" submitenter></x-input>
                <br>
                <button id="newRouteConfirmYes">Toevoegen</button>
                <button id="newRouteConfirmNo">Annuleren</button>
            </div>
        </x-dialog>
    `
}

let table, dialog, currentRow, addStudyRouteDialog, addStudyRouteDialogYesBtn, addStudyRouteDialogNoBtn, xInput, addButton, yesBtn, noBtn;

const deleteYesCallback = async () => {
    if (!currentRow) return

    await fetcher(`studyroute/${currentRow.id}`, { method: "delete" })

    dialog.removeAttribute("open")

    table.reload()

    currentRow = null
}

const deleteNoCallback = () => {
    dialog.removeAttribute("open")
    currentRow = null
}

const saveRouteYesCallback = async () => {
    const xInput = addStudyRouteDialog.querySelector("x-input");
    const routeName = xInput.value.trim();

    xInput.error = "";

    if (!routeName) {
        xInput.error = "Naam mag niet leeg zijn.";
        return;
    }

    try {
        await fetcher(`studyroute?displayName=${encodeURIComponent(routeName)}`, {
            method: "POST",
        });

        table.reload();
        addStudyRouteDialog.removeAttribute("open");
    } catch (err) {
        try {
            const parsed = JSON.parse(err.message.replace("Failed to fetch data: ", ""));
            const displayNameErrors = parsed.errors?.displayName;

            if (displayNameErrors?.length) {
                xInput.error = displayNameErrors[0];
            } else {
                xInput.error = "Onbekende fout bij opslaan.";
            }
        } catch (parseError) {
            xInput.error = "Onbekende fout bij opslaan.";
            console.error("Parsing error response failed:", parseError);
        }

        console.error(err);
    }
};

const newRouteNoCallback = () => {
    addStudyRouteDialog.removeAttribute("open")
}


StudyRoutes.onPageLoaded = () => {
    try {
        /** @type {Datatable} */
        table = document.querySelector("x-data-table")
        dialog = document.querySelector("#confirmDeleteDialog")
        addStudyRouteDialog = document.querySelector("#newStudyRouteDialog")
        addStudyRouteDialogYesBtn = document.querySelector("#newRouteConfirmYes")
        addStudyRouteDialogNoBtn = document.querySelector("#newRouteConfirmNo")
        xInput = document.querySelector("#newRouteName")
        addButton = document.querySelector('#add-button')
        yesBtn = dialog.shadowRoot?.host.querySelector("#confirmYes")
        noBtn = dialog.shadowRoot?.host.querySelector("#confirmNo")

        yesBtn?.addEventListener("click", deleteYesCallback)
        noBtn?.addEventListener("click", deleteNoCallback)
        addButton.addEventListener('click', addOnClick)

        table.dataTable(new DatatableConfig({
            route: "studyroute/mine",
            columns: [
                new DatatableColumn({ path: "id", title: "Id" }),
                new DatatableColumn({ path: "displayName", title: "Naam" })
            ],
            paging: false,
            buttons: new DatatableButtons({
                delete: (row) => {
                    currentRow = row
                    dialog.setAttribute("open", "")
                },
                inspect: (row) => {
                    router.navigate(`/studieroute/${row.id}`)
                },
            })
        }))

        xInput.addEventListener("onSubmitEnter", saveRouteYesCallback)
        addStudyRouteDialogYesBtn.addEventListener("click", saveRouteYesCallback);
        addStudyRouteDialogNoBtn.addEventListener("click", newRouteNoCallback);
    }
    catch (error) {
        console.error(error)
    }
}

function addOnClick() {
    document.querySelector("#newStudyRouteDialog").setAttribute("open", "")
    document.querySelector("x-input").clear();
}

StudyRoutes.onBeforePageUnloaded = () => {
    addButton.removeEventListener('click', addOnClick)
    addStudyRouteDialogYesBtn.removeEventListener("click", saveRouteYesCallback);
    addStudyRouteDialogNoBtn.removeEventListener("click", newRouteNoCallback);
    xInput.removeEventListener("onSubmitEnter", saveRouteYesCallback)
    yesBtn?.removeEventListener("click", deleteYesCallback)
    noBtn?.removeEventListener("click", deleteNoCallback)
    addButton.addEventListener('click', addOnClick)
}
