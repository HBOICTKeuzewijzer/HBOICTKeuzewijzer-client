import '@components/accordion'
import '@components/save-button'

export default function PlannerPage(params) {
    const selectableContent = /*html*/ `
            <div style="display: flex; flex-direction: column; padding: 24px 24px 0; gap: 6px">
                <h5 style="margin: 0; font-size: 18px;">Modules</h5>
                <div class="divider" style="background-color: rgb(var(--color-gray-4)); height:1px;"></div>
                <p style="margin: 0; font-size: 12px;">
                    Dit zijn alle beschikbare modules waaruit je kunt kiezen. Als je een externe module wilt volgen, kun je deze toevoegen via de 'Anders' optie onder 'Overig'.
                </p>
            </div>

            <div style="display: flex; flex-direction: column; padding: 24px;">            
            <custom-accordion type="SE">
            <span slot="title">Software Engineering</span>
            <div class="module-item" slot="content">
                <span>Webdevelopment</span>
            </div>
            <div class="module-item" slot="content">
                <span>Software Engineering</span>
            </div>      
        </custom-accordion>
        <custom-accordion type="IDS">
            <span slot="title">Infrastructure Design & Security</span>
            <div class="module-item" slot="content">
                <span>Applied IT Security</span>
            </div>
            <div class="module-item" slot="content">
                <span>Cloud Computing</span>
            </div>
        </custom-accordion>
        <custom-accordion type="BIM">
            <span slot="title">Business IT & Management</span>
            <div class="module-item" slot="content">
                <span>Datascience</span>
            </div>
            <div class="module-item" slot="content">
                <span>Management of IT</span>
            </div>
        </custom-accordion>
        <custom-accordion type="OVERIG">
            <span slot="title">Overig</span>
            <div class="module-item" slot="content">
                <span>Tussen jaar</span>
            </div>
            <div class="module-item" slot="content">
                <span>Minor</span>
            </div>
            <div class="module-item" slot="content">
                <span>Eigen Keuze</span>
            </div>
        </custom-accordion>
            </div>
        `

    return /*html*/ `
        <div class="container">
            <x-sheet class="hidden md:flex" side="left" open>
                ${selectableContent}
            </x-sheet>
            <x-drawer class="md:hidden" open>
                ${selectableContent}
            </x-drawer>
            <save-share-button>
                <span slot="icon">Opslaan</span>
            </save-share-button>
        </div>
  `
}
