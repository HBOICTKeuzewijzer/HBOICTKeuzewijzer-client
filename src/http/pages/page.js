import '@components/accordion'

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
                <custom-accordion style="--accordion-active-bg-color: #FFF4CE; --accordion-bg-color: #f1f1f1; --circle-color: rgb(var(--color-gold));">
                    <span slot="title">Software Engineering</span>
                    <div class="module-item" slot="content">
                        <p>Webdevelopment</p>
                    </div>
                    <div class="module-item" slot="content">
                        <p>Software Engineering</p>
                    </div>      
                </custom-accordion>
                <custom-accordion active style="--accordion-active-bg-color: rgb(var(--color-light-blue)); --accordion-bg-color: #f1f1f1; --circle-color: rgb(var(--color-blue));">
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
        </div>
  `
}
