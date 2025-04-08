import '../../../components/accordion/accordion.js';

export default function PlannerPage(params) {
  return /*html*/ `
    <x-sheet id="modulesSelector" open>
        <span style="display: flex; flex-direction: column; gap: 4px;">
            <h5 style="margin: 0; font-size: 18px;">Modules</h5>
            <div class="divider" style="background-color: rgb(var(--color-gray-4)); height:1px;"></div>
            <p style="margin: 0; font-size: 12px;">
                Dit zijn alle beschikbare modules waaruit je kunt kiezen. Als je een externe module wilt volgen, kun je deze toevoegen via de 'Anders' optie onder 'Overig'.
            </p>
            <custom-accordion style="--accordion-active-bg-color: #FFF4CE; --accordion-bg-color: #f1f1f1; --circle-color: #ffcb05;">
                <span slot="title">Software Engineering</span>
                <div class="module-item" slot="content">
                    <p>Webdevelopment</p>
                </div>
                <div class="module-item" slot="content">
                    <p>Software Engineering</p>
                </div>      
            </custom-accordion>
            <custom-accordion style="--accordion-active-bg-color: #84D0D9; --accordion-bg-color: #f1f1f1; --circle-color: #1EBCC5;">
                <span slot="title">Infrastructure Design & Security</span>
                <div class="module-item" slot="content">
                    <p>IDS</p>
                </div>
                <div class="module-item" slot="content">
                    <p>IDS2</p>
                </div>
            </custom-accordion>
            <custom-accordion style="--accordion-active-bg-color: #B1D249; --accordion-bg-color: #f1f1f1; --circle-color: #45B97C;">
                <span slot="title">Business IT & Management</span>
                <div class="module-item" slot="content">
                    <p>Datascience</p>
                </div>
                <div class="module-item" slot="content">
                    <p>Management of IT</p>
                </div>
            </custom-accordion>
            <custom-accordion style="--accordion-active-bg-color: #FEDFE4; --accordion-bg-color: #f1f1f1; --circle-color: #f16682;">
                <span slot="title">Overig</span>
                <div class="module-item" slot="content">
                    <p>Tussen jaar</p>
                </div>
                <div class="module-item" slot="content">
                    <p>Minor</p>
                </div>
                <div class="module-item" slot="content">
                    <p>Eigen Keuze</p>
                </div>
            </custom-accordion>
        </span>
    </x-sheet>
    <div class="container"></div>
  `;
}
