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
            <custom-accordion style="--accordion-active-bg-color: #fff578; --accordion-bg-color: #f1f1f1; --circle-color: #ffcb05;">
                <span slot="title">Software Engineering</span>
                <div class="module-item" slot="content">
                    <h6>Webdevelopment</h6>
                </div>
                <div class="module-item" slot="content">
                    <h6>Software Engineering</h6>
                </div>      
            </custom-accordion>
            <custom-accordion style="--accordion-active-bg-color: #84D0D9; --accordion-bg-color: #f1f1f1; --circle-color: #4594d3;">
                <span slot="title">Infrastructure Design & Security</span>
                <div class="module-item" slot="content">
                    <h6>IDS</h6>
                </div>
                <div class="module-item" slot="content">
                    <h6>IDS2</h6>
                </div>
            </custom-accordion>
            <custom-accordion style="--accordion-active-bg-color: #d5e05b; --accordion-bg-color: #f1f1f1; --circle-color: #45b97c;">
                <span slot="title">Business IT & Management</span>
                <div class="module-item" slot="content">
                    <h6>BIM</h6>
                </div>
                <div class="module-item" slot="content">
                    <h6>BIM2</h6>
                </div>
            </custom-accordion>
            <custom-accordion style="--accordion-active-bg-color: #f287b7; --accordion-bg-color: #f1f1f1; --circle-color: #f16682;">
                <span slot="title">Overig</span>
                <div class="module-item" slot="content">
                    <h6>Tussen jaar</h6>
                </div>
                <div class="module-item" slot="content">
                    <h6>Minor</h6>
                </div>
                <div class="module-item" slot="content">
                    <h6>Reparatie</h6>
                </div>
                <div class="module-item" slot="content">
                    <h6>Eigen Keuze</h6>
                </div>
            </custom-accordion>
        </span>
    </x-sheet>
    <div class="container">
    </div>
  `;
}
