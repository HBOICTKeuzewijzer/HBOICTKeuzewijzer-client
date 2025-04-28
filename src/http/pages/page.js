import '@components/save-button'

// --- Modules data
const moduleData = new Map([
    ['SE', { title: 'Software Engineering', modules: [
        { name: 'Webdevelopment', tooltip: 'Berichten' },
        { name: 'Software Engineering', tooltip: 'Berichten' },
    ]}],
    ['IDS', { title: 'Infrastructure Design & Security', modules: [
        { name: 'Applied IT Security', tooltip: 'Berichten' },
        { name: 'Cloud Computing', tooltip: 'Berichten' },
    ]}],
    ['BIM', { title: 'Business IT & Management', modules: [
        { name: 'Datascience', tooltip: 'Berichten' },
        { name: 'Management of IT', tooltip: 'Berichten' },
    ]}],
    ['Overig', { title: 'Overig', modules: [
        { name: 'Tussen jaar', tooltip: 'Berichten' },
        { name: 'Minor', tooltip: 'Berichten' },
        { name: 'Eigen Keuze' },
    ]}],
])

// --- StudyCards data
let studyCardData = [
    [{ status: 'locked', name: 'Basis vaardigheden ICT', description: 'Dit is een beschrijving'}, { status: 'unlocked' }],
    [{ status: 'unlocked' }, { status: 'unlocked' }],
    [{ status: 'unlocked' }, { status: 'unlocked' }],
    [{ status: 'unlocked' }, { status: 'locked', type: 'Overig', name: 'Afstuderen' }],
];

function addAccordionEventListeners() {
    document.removeEventListener('click', delegatedAccordionClickHandler)
    document.addEventListener('click', delegatedAccordionClickHandler)
}

function addSemesterEventListeners() {
    document.removeEventListener('click', delegatedSemesterClickHandler)
    document.addEventListener('click', delegatedSemesterClickHandler)
}

function delegatedAccordionClickHandler(event) {
    const moduleItem = event.target.closest('.module-item')
    if (!moduleItem) return

    handleAccordionItemClick(moduleItem)
}

function delegatedSemesterClickHandler(event) {
    const semester = event.target.closest('[data-card-module]')
    if (!semester) return

    handleSemesterClick(semester)
}

function handleAccordionItemClick(moduleItem) {
    const studyCards = document.querySelectorAll('x-study-card')

    studyCards.forEach(studyCard => {
        const studyYear = studyCard.dataset.year
        if (!studyCard.shadowRoot) return

        const shadowSemesters = studyCard.querySelectorAll('[data-index]')

        shadowSemesters.forEach(shadowDiv => {
            if (shadowDiv.hasAttribute('selected')) {
                const semesterIndex = shadowDiv.dataset.index

                const data = moduleData.get(moduleItem.dataset.type).modules[moduleItem.dataset.index]
                
                // Update studyCardData
                studyCardData[studyYear][semesterIndex] = {
                    ...studyCardData[studyYear][semesterIndex],
                    type: moduleItem.dataset.type,
                    name: data.name,
                    description: data.tooltip
                }

                shadowDiv.removeAttribute('selected') // optional: clear selected
            }
        })
    })

    // After updating the data, re-render
    renderStudyCards()
}

function handleSemesterClick(semester) {
    const studyCards = document.querySelectorAll('x-study-card')

    studyCards.forEach(card => {
        if (!card.shadowRoot) return

        const semesters = card.querySelectorAll('[data-card-module]')
        semesters.forEach(sem => {
            sem.removeAttribute('selected')
        })
    })

    if (semester.dataset.status) {
        semester.setAttribute('selected', '')
    }
}

function renderStudyCards() {
    const container = document.querySelector('#study-cards-container')
    if (!container) return

    container.innerHTML = studyCardData.map((semesters, yearIndex) => `
        <x-study-card data-year="${yearIndex}">
            <span slot="header">Jaar ${yearIndex + 1}</span>
            ${semesters.map((semester, semesterIndex) => `
                <div slot="content-${semesterIndex + 1}" type="${semester.type}" data-card-module data-index="${semesterIndex}" data-status="${semester.status}" class="card-module-item">
                    <div style="display: flex; justify-content: space-between;">
                        <i class="ph ${semester.status === 'locked' ? 'ph-lock-simple' : 'ph-lock-simple-open'}"></i>
                        ${semester.description ? `
                            <x-tooltip position="bottom" placement="left">
                                <div slot="trigger" data-icon><i class="ph ph-info"></i></div>
                                <p style="color: rgb(var(--color-black));">${semester.description}</p>
                            </x-tooltip>
                        ` : ''}
                    </div>
                    ${semester.name || `Optie ${semesterIndex + 1}`}
                </div>
            `).join('')}
        </x-study-card>
    `).join('')
}

export default function PlannerPage(params) {
    PlannerPage.onPageLoaded = () => {
        addAccordionEventListeners()
        addSemesterEventListeners()
        renderStudyCards()
    }

    const selectableContent = /*html*/ `
        <div style="display: flex; flex-direction: column; padding: 24px 24px 0; gap: 6px;">
            <h5 style="margin: 0; font-size: 18px;">Modules</h5>
            <div class="divider" style="background-color: rgb(var(--color-gray-4)); height: 1px;"></div>
            <p style="margin: 0; font-size: 12px;">
                Dit zijn alle beschikbare modules waaruit je kunt kiezen. Als je een externe module wilt volgen, kun je deze toevoegen via de 'Anders' optie onder 'Overig'.
            </p>
        </div>

        <div style="display: flex; flex-direction: column; padding: 24px;">
            ${Array.from(moduleData.entries()).map(([type, { title, modules }]) => `
                <x-accordion type="${type}">
                    <span slot="title">${title}</span>
                    ${modules.map(({ name, tooltip }, moduleIndex) => `
                        <div class="module-item" data-type="${type}" data-index="${moduleIndex}">
                            <span>${name}</span>
                            ${tooltip ? `
                                <x-tooltip position="left" placement="middle">
                                    <div slot="trigger" data-icon><i class="ph ph-info"></i></div>
                                    <p class="color-black text-sm">${tooltip}</p>
                                </x-tooltip>
                            ` : ''}
                        </div>
                    `).join('')}
                </x-accordion>
            `).join('')}
        </div>
    `;

    return /*html*/ `
        <div class="container flex" style="position: relative; flex-direction: row;">
            <x-sheet class="hidden md:flex" side="left" open>
                ${selectableContent}
            </x-sheet>

            <x-drawer class="md:hidden" open>
                ${selectableContent}
            </x-drawer>

            <div style="overflow: hidden; position: relative; flex: 1; display: flex; flex-direction: column; max-height: calc(100% - var(--header-height) - 64px);">
                <div id="study-cards-container" style="display: flex; width: 100%; height: 100%; max-width: 700px; flex-wrap: wrap; justify-content: space-between; margin: auto;">
                </div>
            </div>

            <div style="position: absolute; right: 32px; top: 32px;">
                <x-popover position="bottom" placement="right">
                    <button slot="trigger" style="cursor: pointer; align-items: center; display: flex; gap: 8px; background: white; border: 1px solid rgba(var(--color-gray-4), 0.2);">
                        <i class="ph-duotone ph-share-network"></i>Delen
                    </button>

                    <button popover-action type="button" class="text-sm">
                        <i class="ph-duotone ph-download"></i>Save as PDF
                    </button>

                    <button popover-action type="button" class="text-sm">
                        <i class="ph-duotone ph-link"></i>Copy link
                    </button>
                </x-popover>
            </div>
        </div>
    `;
}
