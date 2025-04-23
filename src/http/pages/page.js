import '@components/accordion';
import '@components/save-button';

export default function PlannerPage(params) {
    return /*html*/ `
    <x-sheet id="modulesSelector" open>
        <span style="display: flex; flex-direction: column; gap: 4px;">
            <h5 style="margin: 0; font-size: 18px;">Modules</h5>
            <div class="divider" style="background-color: rgb(var(--color-gray-4)); height:1px;"></div>
            <p style="margin: 0; font-size: 12px;">
                Dit zijn alle beschikbare modules waaruit je kunt kiezen. Als je een externe module wilt volgen, kun je deze toevoegen via de 'Anders' optie onder 'Overig'.
            </p>
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
        </span>
    </x-sheet>
    <div class="container">
        <save-share-button>
            <span slot="icon">Opslaan</span>
        </save-share-button>
    </div>
  `;
}
