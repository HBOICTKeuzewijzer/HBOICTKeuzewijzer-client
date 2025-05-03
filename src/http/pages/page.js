import { fetcher } from '@/utils'
import { Module } from '@/models'

/**
 * Stores available module categories with their respective titles.
 * Module data is populated dynamically via `loadModules`.
 * @type {Map<string, { title: string, modules?: Module[] }>}
 */
let moduleData = new Map([
    ['SE', { title: 'Software Engineering' }],
    ['IDS', { title: 'Infrastructure Design & Security' }],
    ['BIM', { title: 'Business IT & Management' }],
    ['OVERIG', { title: 'Overig' }],
])

/**
 * Represents initial study card state for each year and semester.
 * Each item may include status, name, type, and description.
 */
let studyCardData = [
    [
        { status: 'locked', name: 'Basis vaardigheden ICT', description: 'Dit is een beschrijving' },
        { status: 'unlocked' },
    ],
    [{ status: 'unlocked' }, { status: 'unlocked' }],
    [{ status: 'unlocked' }, { status: 'unlocked' }],
    [{ status: 'unlocked' }, { status: 'locked', type: 'Overig', name: 'Afstuderen' }],
]

/**
 * Handles click events on accordion module items using event delegation.
 * @param {MouseEvent} event
 */
function delegatedAccordionClickHandler(event) {
    const moduleItem = event.target.closest('.module-item')
    if (!moduleItem) return

    handleAccordionItemClick(moduleItem)
}

/**
 * Handles click events on semester elements using event delegation.
 * @param {MouseEvent} event
 */
function delegatedSemesterClickHandler(event) {
    const semester = event.target.closest('[data-card-module]')
    if (!semester) return

    handleSemesterClick(semester)
}

/**
 * Handles click events on semester elements using event delegation.
 * @param {MouseEvent} event
 */
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
}

/**
 * Handles selection highlighting for a semester card.
 * @param {HTMLElement} semester
 */
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

/**
 * Renders all study cards based on `studyCardData`.
 */
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

/**
 * Fetches available modules from the API and populates `moduleData`.
 * Then triggers rendering of the accordion UI.
 */
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

/**
 * Renders the module accordion UI for both desktop and mobile containers.
 */
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

/**
 * Draws SVG paths between consecutive study cards to visualize progression.
 */
function drawConnections() {
    const container = document.querySelector('#study-cards-container')
    if (!container) return

    let svg = document.getElementById('connection-svg')
    if (!svg) {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.setAttribute('id', 'connection-svg')
        svg.style.position = 'absolute'
        svg.style.top = '0'
        svg.style.left = '0'
        svg.style.pointerEvents = 'none'
        svg.style.zIndex = '0'
        
        container.appendChild(svg)
    }

    svg.innerHTML = ''
    svg.setAttribute('width', container.scrollWidth)
    svg.setAttribute('height', container.scrollHeight)

    const cards = Array.from(container.querySelectorAll('x-study-card'))
    if (cards.length < 2) return

    const isMobile = window.innerWidth <= 768

    for (let i = 0; i < cards.length - 1; i++) {
        const fromCard = cards[i].getBoundingClientRect()
        const toCard = cards[i + 1].getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()

        let startX = fromCard.right - containerRect.left
        let startY = fromCard.top + fromCard.height / 2 - containerRect.top
        let endX = toCard.left - containerRect.left
        let endY = toCard.top + toCard.height / 2 - containerRect.top

        let midX1 = startX + 40
        let midY = (startY + endY) / 2
        let midX2 = endX - 40

        if (isMobile) {
            startX = fromCard.left + fromCard.width / 2 - containerRect.left
            startY = fromCard.bottom - containerRect.top
            endX = toCard.left + toCard.width / 2 - containerRect.left
            endY = toCard.top - containerRect.top

            midX1 = startX
            midX2 = endX
        }

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute('d', `M ${startX} ${startY} H ${midX1} V ${midY} H ${midX2} V ${endY} H ${endX}`)
        path.setAttribute('stroke', 'rgba(var(--color-gold), 0.6)')
        path.setAttribute('fill', 'none')
        path.setAttribute('stroke-width', '7')
        svg.appendChild(path)

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        circle.setAttribute('cx', endX)
        circle.setAttribute('cy', endY)
        circle.setAttribute('r', 10)
        circle.setAttribute('fill', 'rgb(var(--color-gold))')
        svg.appendChild(circle)
    }
}

export default function PlannerPage() {
    PlannerPage.onPageLoaded = () => {
        document.addEventListener('click', delegatedAccordionClickHandler)
        document.addEventListener('click', delegatedSemesterClickHandler)

        window.addEventListener('resize', () => {
            requestAnimationFrame(drawConnections)
        })

        loadModules().catch(console.error)
        renderStudyCards()
        drawConnections()
    }

    return /*html*/ `
        <div class="container flex" style="position: relative; flex-direction: row; overflow: hidden; max-height: calc(100vh - var(--header-height));">
            <x-sheet class="hidden xl:flex" side="left" open>
                <div style="padding: 24px 24px 0; display: flex; flex-direction: column; gap: 6px;">
                    <h5 style="margin: 0; font-size: 18px;">Modules</h5>
                    <div class="divider" style="background-color: rgb(var(--color-gray-4)); height:1px;"></div>
                    <p style="margin: 0; font-size: 12px;">
                        Dit zijn alle beschikbare modules waaruit je kunt kiezen. Als je een externe module wilt volgen, kun je deze toevoegen via de 'Anders' optie onder 'Overig'.
                    </p>
                </div>
                <div id="modules-list-desktop" style="display: flex; flex-direction: column; padding: 24px;"></div>
            </x-sheet>

            <x-drawer class="xl:hidden" open>
                <div id="modules-list-mobile" style="padding: 24px;"></div>
            </x-drawer>

            <form id="study-cards-container" style></form>

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
