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
            <x-accordion type="SE">
            <span slot="title">Software Engineering</span>
            <div class="module-item">
                <span>Webdevelopment</span>
                <x-tooltip position="left" placement="middle">
                    <div slot="trigger" data-icon>
                        <i class="ph ph-info"></i>
                    </div>
                    <p class="color-black text-sm">
                        Berichten
                    </p>
                </x-tooltip>
            </div>
            <div class="module-item">
                <span>Software Engineering</span>
                <x-tooltip position="left" placement="middle">
                <div slot="trigger" data-icon>
                    <i class="ph ph-info"></i>
                </div>
                <p class="color-black text-sm">
                    Berichten
                </p>
            </x-tooltip>
            </div>      
        </x-accordion>
        <x-accordion type="IDS">
            <span slot="title">Infrastructure Design & Security</span>
            <div class="module-item">
                <span>Applied IT Security</span>
                <x-tooltip position="left" placement="middle">
                <div slot="trigger" data-icon>
                    <i class="ph ph-info"></i>
                </div>
                <p class="color-black text-sm">
                    Berichten
                </p>
            </x-tooltip>
            </div>
            <div class="module-item">
                <span>Cloud Computing</span>
                <x-tooltip position="left" placement="middle">
                <div slot="trigger" data-icon>
                    <i class="ph ph-info"></i>
                </div>
                <p class="color-black text-sm">
                    Berichten
                </p>
            </x-tooltip>
            </div>
        </x-accordion>
        <x-accordion type="BIM">
            <span slot="title">Business IT & Management</span>
            <div class="module-item">
                <span>Datascience</span>
                <x-tooltip position="left" placement="middle">
                <div slot="trigger" data-icon>
                    <i class="ph ph-info"></i>
                </div>
                <p class="color-black text-sm">
                    Berichten
                </p>
            </x-tooltip>
            </div>
            <div class="module-item">
                <span>Management of IT</span>
                <x-tooltip position="left" placement="middle">
                <div slot="trigger" data-icon>
                    <i class="ph ph-info"></i>
                </div>
                <p class="color-black text-sm">
                    Berichten
                </p>
            </x-tooltip>
            </div>
        </x-accordion>
        <x-accordion type="Overig">
            <span slot="title">Overig</span>
            <div class="module-item">
                <span>Tussen jaar</span>
                <x-tooltip position="left" placement="middle">
                <div slot="trigger" data-icon>
                    <i class="ph ph-info"></i>
                </div>
                <p class="color-black text-sm">
                    Berichten
                </p>
            </x-tooltip>
            </div>
            <div class="module-item">
                <span>Minor</span>
                <x-tooltip position="left" placement="middle">
                <div slot="trigger" data-icon>
                    <i class="ph ph-info"></i>
                </div>
                <p class="color-black text-sm">
                    Berichten
                </p>
            </x-tooltip>
            </div>
            <div class="module-item">
                <span>Eigen Keuze</span>
            </div>
        </x-accordion>
            </div>
        `

    return /*html*/ `
        <div class="container">
            <x-sheet class="hidden md:flex" side="left" open floating>
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
