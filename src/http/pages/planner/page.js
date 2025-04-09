import '@components/accordion';
import '../../../components/studyCard/studyCard.js';


export default function PlannerPage(params) {
    return /*html*/ `
    <x-sheet id="modulesSelector" open>
        <span style="display: flex; flex-direction: column; gap: 4px;">
            <h5 style="margin: 0; font-size: 18px;">Modules</h5>
            <div class="divider" style="background-color: rgb(var(--color-gray-4)); height:1px;"></div>
            <p style="margin: 0; font-size: 12px;">
                Dit zijn alle beschikbare modules waaruit je kunt kiezen. Als je een externe module wilt volgen, kun je deze toevoegen via de 'Anders' optie onder 'Overig'.
            </p>
            <custom-accordion style="--accordion-active-bg-color: #FFF4CE; --accordion-bg-color: #f1f1f1; --circle-color: rgb(var(--color-gold));">
                <span slot="title">Software Engineering</span>
                <div class="module-item" slot="content">
                    <p>Webdevelopment</p>
                </div>
                <div class="module-item" slot="content">
                    <p>Software Engineering</p>
                </div>
            </custom-accordion>
            <custom-accordion style="--accordion-active-bg-color: rgb(var(--color-light-blue)); --accordion-bg-color: #f1f1f1; --circle-color: rgb(var(--color-sky-blue));">
                <span slot="title">Infrastructure Design & Security</span>
                <div class="module-item" slot="content">
                    <p>Applied IT Security</p>
                </div>
                <div class="module-item" slot="content">
                    <p>Cloud Computing</p>
                </div>
            </custom-accordion>
            <custom-accordion style="--accordion-active-bg-color: rgb(var(--color-apple-green)); --accordion-bg-color: #f1f1f1; --circle-color: rgb(var(--color-dark-green));">
                <span slot="title">Business IT & Management</span>
                <div class="module-item" slot="content">
                    <p>Datascience</p>
                </div>
                <div class="module-item" slot="content">
                    <p>Management of IT</p>
                </div>
            </custom-accordion>
            <custom-accordion style="--accordion-active-bg-color: #FEDFE4; --accordion-bg-color: #f1f1f1; --circle-color: rgb(var(--color-dark-pink));">
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
    <div class="study-cards-container" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; justify-content: center; padding: 20px;">
        <!-- Year 1: Locked -->
        <study-card>
            <span slot="year-header">Jaar 1</span>
            <span slot="semester-1-title">Semester 1</span>
            <span slot="semester-1-content">Basisconcepten ICT 1</span>
            <span slot="semester-2-title">Semester 2</span>
            <span slot="semester-2-content">Basisconcepten ICT 2</span>
        </study-card>
        <!-- Year 2: Open -->
        <study-card>
            <span slot="year-header">Year 2</span>
            <span slot="semester-1-title">Semester 1</span>
            <span slot="semester-1-content">Keuze 1</span>
            <span slot="semester-2-title">Semester 2</span>
            <span slot="semester-2-content">Keuze 2</span>
        </study-card>
        <!-- Year 3: Open -->
        <study-card>
            <span slot="year-header">Year 3</span>
            <span slot="semester-1-title">Semester 1</span>
            <span slot="semester-1-content">Keuze 1</span>
            <span slot="semester-2-title">Semester 2</span>
            <span slot="semester-2-content">Keuze 2</span>
        </study-card>
        <!-- Year 4: Open -->
        <study-card>
            <span slot="year-header">Year 4</span>
            <span slot="semester-1-title">Semester 1</span>
            <span slot="semester-1-content">Keuze 1</span>
            <span slot="semester-2-title">Semester 2</span>
            <span slot="semester-2-content">Keuze 2</span>
        </study-card>
        <study-card>
        <span slot="year-header">Year 5</span>"
        span slot="semester-1-title">Semester 1</span>
        span slot="semester-1-content">Keuze 1</span>
        span slot="semester-2-title">Semester 2</span>
        span slot ="semester-2-content">Keuze 2</span>
        </study-card>
    </div>

  `;
}
