import { fetcher } from '@/utils'
import { Module, Category, Semester, StudyRoute, CustomModule } from '@/models'
import Modal from '@/components/modal'

const modal = new Modal()

let studyRouteId = null

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

    const drawer = document.querySelector('x-drawer')
    if (!drawer.hasAttribute('open')) drawer.setAttribute('open', '')

    handleSemesterClick(semester)
}

/**
 * Finds a Module by its ID.
 * @param {string} id - The GUID of the module to find.
 * @returns {Module | undefined} The matched module, or undefined if not found.
 */
function getModuleById(id) {
    for (const [, modules] of moduleData.entries()) {
        const found = modules.find(module => module.id === id)
        if (found) return found
    }
    return undefined
}

/**
 * Handles click events on semester elements using event delegation.
 * @param {MouseEvent} event
 */
async function handleAccordionItemClick(moduleItem) {
    if (studyRoute === null) return
    if (selectedSemester === undefined || selectedSemester === null) return

    const semesterIndex = selectedSemester.dataset.semesterindex
    if (studyRoute.semesters[semesterIndex].module?.required === true) {
        return
    }

    studyRoute.semesters[semesterIndex].moduleId = moduleItem.dataset.guid
    studyRoute.semesters[semesterIndex].module = getModuleById(moduleItem.dataset.guid)

    const drawer = document.querySelector('x-drawer')
    if (drawer.hasAttribute('open')) drawer.removeAttribute('open')

    renderStudyCards()
    drawConnections()
}

let selectedSemester

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

    selectedSemester = semester
}

let studyRoute

async function loadStudyRoute() {
    const requiredModules = []

    for (const [category, modules] of moduleData.entries()) {
        if (Array.isArray(modules)) {
            const required = modules.filter(module => module.required === true)
            requiredModules.push(...required)
        }
    }

    studyRoute = new StudyRoute()
    studyRoute.semesters = [
        new Semester({
            id: "5B59BE13-0F24-4F3E-8C5A-C3A99D08E7F6",
            index: 0,
            acquiredECs: 0,
        }),
        new Semester({
            id: "8F7FED8A-6A8A-454E-BE05-D6B1C66F9C3E",
            index: 1,
            acquiredECs: 0,
        }),
        new Semester({
            id: "2CF53F55-7896-488D-9C3C-CCA726093379",
            index: 2,
            acquiredECs: 0,
        }),
        new Semester({
            id: "3F1F4470-AF74-4092-9412-E2B264C7E763",
            index: 3,
            acquiredECs: 0,
        }),
        new Semester({
            id: "40690D5D-33CE-4FA6-9FF1-AEE5193DB326",
            index: 4,
            acquiredECs: 0,
        }),
        new Semester({
            id: "14906BED-FBE4-4CEF-86E3-37F664586FE7",
            index: 5,
            acquiredECs: 0,
        }),
        new Semester({
            id: "4CB71888-38EB-4BAB-8B6A-9D248933B4DE",
            index: 6,
            acquiredECs: 0,
        }),
        new Semester({
            id: "6A0865C5-69F7-4402-8C52-973F6997A79C",
            index: 7,
            acquiredECs: 0,
        }),
    ]

    requiredModules.forEach(module => {
        var semesterIndex = module.requiredSemester ? module.requiredSemester : 0

        var relevantSemester = studyRoute.semesters[semesterIndex]

        relevantSemester.module = module
        relevantSemester.moduleId = module.id
    })

    renderStudyCards()
}



/**
 * Renders all study cards based on `studyCardData`.
 */
function renderStudyCards() {
    const studyRouteSemesters = studyRoute?.semesters
    const container = document.querySelector('#study-cards-container')
    if (!container) return

    container.innerHTML = ""

    const statusIconMap = {
        locked: 'ph-lock-simple',
        unlocked: 'ph-lock-simple-open',
    }

    const yearCount = Math.ceil(studyRouteSemesters.length / 2)

    let semesterModelIndex = 0

    for (let yearIndex = 0; yearIndex < yearCount; yearIndex++) {
        let semesterOneIndex = semesterModelIndex++
        let semesterTwoIndex = semesterModelIndex++
        let semesterOne = studyRouteSemesters[semesterOneIndex]
        let semesterTwo = studyRouteSemesters[semesterTwoIndex]

        let moduleOne = semesterOne.module
        let moduleTwo = semesterTwo.module

        let semesterOneLockStatus = moduleOne?.required ? "locked" : "unlocked"
        let semesterTwoLockStatus = moduleTwo?.required ? "locked" : "unlocked"

        container.innerHTML += /*html*/`
            <x-study-card data-year="${yearIndex}">
                <span data-testid="study-card-year" slot="header">Jaar ${yearIndex + 1}</span>
                <div slot="content-1" data-card-module data-index="0" data-status="${semesterOneLockStatus}" data-semesterindex="${semesterOneIndex}" class="card-module-item"
                    ${moduleOne ? `style="--primary-color: ${hexToRGB(moduleOne.category?.primaryColor ?? '#cccccc')}; --accent-color: ${hexToRGB(moduleOne.category?.accentColor ?? '#999999')};"` : 'type="empty"'}>
                    <input name="choice[${yearIndex + 1}][1]" hidden/>
                    <div style="display: flex; justify-content: space-between;">
                        <i class="ph ${statusIconMap[semesterOneLockStatus]}"></i>
                        ${moduleOne ? createTooltipContent(moduleOne) : ''}
                    </div>
                    ${moduleOne ? moduleOne.name : `Optie 1`}
                </div>

                
                <div slot="content-2" data-card-module data-index="1" data-status="${semesterTwoLockStatus}" data-semesterindex="${semesterTwoIndex}" class="card-module-item"
                    ${moduleTwo ? `style="--primary-color: ${hexToRGB(moduleTwo.category?.primaryColor ?? '#cccccc')}; --accent-color: ${hexToRGB(moduleTwo.category?.accentColor ?? '#999999')};"` : 'type="empty"'}>
                    <input name="choice[${yearIndex + 1}][2]" hidden/>
                    <div style="display: flex; justify-content: space-between;">
                        <i class="ph ${statusIconMap[semesterTwoLockStatus]}"></i>
                        ${moduleTwo ? createTooltipContent(moduleTwo) : ''}
                    </div>
                    ${moduleTwo ? moduleTwo.name : `Optie 2`}
                </div>
            </x-study-card>
        `
    }
}

function createTooltipContent(module) {
    return `
      <div class="info-icon" style="cursor: pointer;" data-guid="${module.id}" data-type="standard">
        <i class="ph ph-info"></i>
      </div>
    `
}

/**
 * Stores available module categories with their respective titles.
 * Module data is populated dynamically via `loadModules`.
 * @type {Map<string, { title: Category, modules?: Module[] }>}
 */
let moduleData

async function loadModules() {
    try {
        moduleData = new Map()

        let [categories, modules] = await Promise.all([
            (async () => {
                const data = await fetcher('category', { method: 'GET' })
                return data.map(element => new Category(element))
            })(),
            (async () => {
                const data = await fetcher('module', { method: 'GET' })
                return data.map(element => new Module(element))
            })(),
        ])

        categories.forEach(category => {
            moduleData.set(category, [])
        })

        modules.forEach(module => {
            const category = categories.find(c => c.id === module.category.id)
            if (category) {
                moduleData.get(category).push(module)
            } else {
                console.warn(`Module '${module.name}' has unknown categoryId: ${module.category.id}`)
            }
        })

        renderModuleAccordion()
    } catch (error) {
        console.error('Modules ophalen mislukt:', error)
    }
}

function hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "" + r + ", " + g + ", " + b + ", " + alpha;
    } else {
        return "" + r + ", " + g + ", " + b;
    }
}

/**
 * Renders the module accordion UI for both desktop and mobile containers.
 */
function renderModuleAccordion() {
    const containers = [document.querySelector('#modules-list-desktop'), document.querySelector('#modules-list-mobile')]

    const accordionHTML = Array.from(moduleData.entries())
        .map(
            ([category, modules]) => `
                <x-accordion
                    style="--primary-color: ${hexToRGB(category.primaryColor)}; --accent-color: ${hexToRGB(category.accentColor)};"
                >
                <span slot="title">${category.value}</span>
                ${modules.map(
                (module, index) => `
                        <div class="module-item" data-index="${index}" data-guid="${module.id}" data-type="standard">
                            <span>${module.name}</span>
                            ${module.description
                        ? `<div class="info-icon" style="cursor: pointer;" data-guid="${module.id}" data-type="${module instanceof CustomModule || module.isCustom ? 'custom' : 'standard'}">
                                <i class="ph ph-info"></i>
                            </div>`
                        : ''
                    }
                        </div>`
            ).join('')}
                </x-accordion>
            `
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
    svg.setAttribute('width', 0)
    svg.setAttribute('height', 0)
    svg.setAttribute('width', container.scrollWidth)
    svg.setAttribute('height', container.scrollHeight)

    const cards = Array.from(container.querySelectorAll('x-study-card'))
    if (cards.length < 2) return

    const isMobile = window.innerWidth <= 768

    for (let i = 0; i < cards.length - 1; i++) {
        const fromCard = cards[i].getBoundingClientRect()
        const toCard = cards[i + 1].getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        const scrollTop = container.scrollTop

        let startX = fromCard.right - containerRect.left
        let startY = ((fromCard.top + (fromCard.height / 2)) - containerRect.top) + scrollTop
        let endX = toCard.left - containerRect.left
        let endY = ((toCard.top + (toCard.height / 2)) - containerRect.top) + scrollTop

        let midX1 = startX + 40
        let midY = (startY + endY) / 2
        let midX2 = endX - 40

        if (isMobile) {
            startX = fromCard.left + fromCard.width / 2 - containerRect.left
            startY = (fromCard.bottom - containerRect.top) + scrollTop
            endX = toCard.left + toCard.width / 2 - containerRect.left
            endY = (toCard.top - containerRect.top) + scrollTop

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

export default function PlannerPage({ params }) {
    studyRouteId = params?.uuid ?? null

    return /*html*/ `
        <div class="container flex" style="position: relative; flex-direction: row; overflow: hidden; max-height: calc(100vh - var(--header-height));">
            <x-sheet data-testid="module-sheet" class="hidden xl:flex" side="left" open>
                <div style="padding: 24px 24px 0; display: flex; flex-direction: column; gap: 6px;">
                    <h5 style="margin: 0; font-size: 18px;">Modules</h5>
                    <div class="divider" style="background-color: rgb(var(--color-gray-4)); height:1px;"></div>
                    <p style="margin: 0; font-size: 12px;">
                        Dit zijn alle beschikbare modules waaruit je kunt kiezen. Als je een externe module wilt volgen, kun je deze toevoegen via de 'Anders' optie onder 'Overig'.
                    </p>
                </div>
                <div id="modules-list-desktop" style="display: flex; flex-direction: column; padding: 24px;"></div>
            </x-sheet>

            <x-drawer data-testid="module-drawer" class="xl:hidden">
                <div id="modules-list-mobile" style="padding: 24px;"></div>
            </x-drawer>

            <form id="study-cards-container" style></form>
        </div>
    `
}

PlannerPage.onPageLoaded = async () => {
    document.addEventListener('click', delegatedAccordionClickHandler)
    document.addEventListener('click', delegatedSemesterClickHandler)

    document.addEventListener('click', (e) => {
        const infoIcon = e.target.closest('.info-icon')
        if (!infoIcon) return

        const guid = infoIcon.dataset.guid
        const type = infoIcon.dataset.type

        const module = getModuleById(guid)
        if (!module) return

        const isCustom = type === 'custom'

        modal.setOnSaveCallback((updatedModule) => {
            const semesterIndex = selectedSemester.dataset.semesterindex

            const newModule = new CustomModule(updatedModule)
            studyRoute.semesters[semesterIndex].moduleId = newModule.id
            studyRoute.semesters[semesterIndex].module = newModule

            renderStudyCards()
            drawConnections()
        })

        modal.open(module, isCustom)
    })


    window.addEventListener('resize', () => {
        requestAnimationFrame(drawConnections)
    })

    await loadModules().catch(console.error)
    await loadStudyRoute()
    renderStudyCards()
    drawConnections()
}
