import { fetcher } from '@/utils'
import { Module } from '@/models'

let moduleData = new Map([
    ['SE', { title: 'Software Engineering' }],
    ['IDS', { title: 'Infrastructure Design & Security' }],
    ['BIM', { title: 'Business IT & Management' }],
    ['OVERIG', { title: 'Overig' }],
])

let studyCardData = [
    [
        { status: 'locked', name: 'Basis vaardigheden ICT', description: 'Dit is een beschrijving' },
        { status: 'unlocked' },
    ],
    [{ status: 'unlocked' }, { status: 'unlocked' }],
    [{ status: 'unlocked' }, { status: 'unlocked' }],
    [{ status: 'unlocked' }, { status: 'locked', type: 'Overig', name: 'Afstuderen' }],
]

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
                const modules = moduleData.get(moduleItem.dataset.type).modules
                const data = modules[moduleItem.dataset.index]

                studyCardData[studyYear][semesterIndex] = {
                    ...studyCardData[studyYear][semesterIndex],
                    data,
                }

                shadowDiv.removeAttribute('selected')
            }
        })
    })

    renderStudyCards()
    drawConnections()
}

function handleSemesterClick(semester) {
    const studyCards = document.querySelectorAll('x-study-card')
    studyCards.forEach(card => {
        if (!card.shadowRoot) return
        const semesters = card.querySelectorAll('[data-card-module]')
        semesters.forEach(sem => sem.removeAttribute('selected'))
    })

    if (semester.dataset.status) {
        semester.setAttribute('selected', '')
    }
}

function renderStudyCards() {
    const container = document.querySelector('#study-cards-container')
    if (!container) return

    const statusIconMap = {
        locked: 'ph-lock-simple',
        unlocked: 'ph-lock-simple-open',
    }

    container.innerHTML = studyCardData
        .map(
            (semesters, yearIndex) => `
            <x-study-card data-year="${yearIndex}">
                <span slot="header">Jaar ${yearIndex + 1}</span>
                ${semesters
                    .map(
                        (semester, semesterIndex) => `
                        <div slot="content-${semesterIndex + 1}" type="${semester.type}" data-card-module data-index="${semesterIndex}" data-status="${semester.status}" class="card-module-item">
                            <input name="choice[${yearIndex + 1}][${semesterIndex + 1}]" hidden/>
                            <div style="display: flex; justify-content: space-between;">
                                <i class="ph ${statusIconMap[semester.status] || 'ph-question'}"></i>
                                ${
                                    semester.description
                                        ? `<x-tooltip position="bottom" placement="left">
                                                <div slot="trigger" data-icon><i class="ph ph-info"></i></div>
                                                <p style="color: rgb(var(--color-black));">${semester.description}</p>
                                           </x-tooltip>`
                                        : ''
                                }
                            </div>
                            ${semester.name || `Optie ${semesterIndex + 1}`}
                        </div>
                    `,
                    )
                    .join('')}
            </x-study-card>
        `,
        )
        .join('')
}

async function loadModules() {
    try {
        const response = await fetcher('Module', { method: 'GET' })

        console.log(response)
        response.items.forEach(item => {
            const module = new Module(item)
            const category = module.category

            const existingData = moduleData.get(category) || { modules: [] }
            moduleData.set(category, {
                ...existingData,
                modules: [...existingData.modules, module],
            })
        })

        renderModuleAccordion()
    } catch (error) {
        console.error('Modules ophalen mislukt:', error)
    }
}

function renderModuleAccordion() {
    const containers = [document.querySelector('#modules-list-desktop'), document.querySelector('#modules-list-mobile')]

    const accordionHTML = Array.from(moduleData.entries())
        .map(
            ([type, { title, modules = [] }]) => `
            <x-accordion type="${type}">
                <span slot="title">${title}</span>
                ${modules
                    .map(
                        (module, index) => `
                        <div class="module-item" data-type="${type}" data-index="${index}">
                            <span>${module.name}</span>
                            ${
                                module.description
                                    ? `<x-tooltip position="left" placement="middle">
                                           <div slot="trigger" data-icon><i class="ph ph-info"></i></div>
                                           <p class="color-black text-sm">${module.description}</p>
                                       </x-tooltip>`
                                    : ''
                            }
                        </div>`,
                    )
                    .join('')}
            </x-accordion>
        `,
        )
        .join('')

    containers.forEach(container => {
        if (container) container.innerHTML = accordionHTML
    })
}

export default function PlannerPage() {
    PlannerPage.onPageLoaded = () => {
        window.addEventListener('resize', drawConnections)
        
        document.removeEventListener('click', delegatedAccordionClickHandler)
        document.addEventListener('click', delegatedAccordionClickHandler)
        document.removeEventListener('click', delegatedSemesterClickHandler)
        document.addEventListener('click', delegatedSemesterClickHandler)

        loadModules().catch(console.error)
        renderStudyCards()
    }

    return /*html*/ `
        <div class="container flex" style="position: relative; flex-direction: row; overflow: hidden; max-height: calc(100vh - var(--header-height));">
            <x-sheet class="hidden lg:flex" side="left" open>
                <div style="padding: 24px 24px 0; display: flex; flex-direction: column; gap: 6px;">
                    <h5 style="margin: 0; font-size: 18px;">Modules</h5>
                    <div class="divider" style="background-color: rgb(var(--color-gray-4)); height:1px;"></div>
                    <p style="margin: 0; font-size: 12px;">
                        Dit zijn alle beschikbare modules waaruit je kunt kiezen. Als je een externe module wilt volgen, kun je deze toevoegen via de 'Anders' optie onder 'Overig'.
                    </p>
                </div>
                <div id="modules-list-desktop" style="display: flex; flex-direction: column; padding: 24px;"></div>
            </x-sheet>

            <x-drawer class="lg:hidden" open>
                <div id="modules-list-mobile" style="padding: 24px;"></div>
            </x-drawer>

            <form id="study-cards-container" style="display: flex; overflow-y: auto; max-height: calc(100vh - var(--header-height) - 64px); height: 100vh; max-width: 700px; flex-wrap: wrap; justify-content: center; margin: auto; gap: 100px;"></form>

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
    `
}
