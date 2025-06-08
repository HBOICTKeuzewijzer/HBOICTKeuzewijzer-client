import { fetcher } from '@/utils'
import { Module, Category, StudyRoute, CustomModule } from '@/models'
import Modal from '@/components/modal'
import html2pdf from 'html2pdf.js'

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

    if (studyRoute?.semesters) {
        for (const semester of studyRoute.semesters) {
            if (semester.customModule?.id === id) {
                return semester.customModule
            }
        }
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

    const clickedModule = getModuleById(moduleItem.dataset.guid)
    if (clickedModule instanceof CustomModule) {
        if (studyRoute.semesters[semesterIndex].moduleId !== null) {
            studyRoute.semesters[semesterIndex].acquiredECs = 0
        }

        studyRoute.semesters[semesterIndex].customModule = clickedModule
        studyRoute.semesters[semesterIndex].customModuleId = clickedModule.id
        studyRoute.semesters[semesterIndex].module = null
        studyRoute.semesters[semesterIndex].moduleId = null
    } else {
        studyRoute.semesters[semesterIndex].customModule = null
        studyRoute.semesters[semesterIndex].module = clickedModule
        studyRoute.semesters[semesterIndex].moduleId = clickedModule.id
        studyRoute.semesters[semesterIndex].customModuleId = null

        studyRoute.semesters[semesterIndex].acquiredECs = 0
    }

    saveRoute()
}

async function saveRoute() {
    try {
        studyRoute.semesters.forEach(s => s.errors = null)
        await fetcher(`studyRoute/${studyRouteId}`, { method: 'PUT', body: studyRoute.toJson() })
    }
    catch (err) {
        try {
            const parsed = JSON.parse(err.message.replace("Failed to fetch data: ", ""));
            const errors = parsed.errors;

            applyValidationErrors(errors)
        } catch (parseError) {
            console.error("Parsing error response failed:", parseError);
        }
    }

    renderStudyCards()
    drawConnections()
}

function applyValidationErrors(errors) {
    for (const [key, value] of Object.entries(errors)) {
        var relevantSemester = studyRoute.semesters.find(s => s.id === key)
        relevantSemester.errors = value
    }
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
    if (studyRouteId === null) return

    const data = await fetcher(`studyRoute/${studyRouteId}`, { method: 'GET' })

    if (!data.semesters) return

    studyRoute = new StudyRoute(data)
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

        // Pick customModule if it exists, otherwise a module
        let moduleOne = semesterOne.customModule ?? semesterOne.module
        let moduleTwo = semesterTwo.customModule ?? semesterTwo.module

        let semesterOneLockStatus = moduleOne?.required ? "locked" : "unlocked"
        let semesterTwoLockStatus = moduleTwo?.required ? "locked" : "unlocked"

        container.innerHTML += /*html*/`
            <x-study-card data-year="${yearIndex}">
                <span slot="header">Jaar ${yearIndex + 1}</span>
                
                
                <div slot="content-1" data-card-module data-index="0" data-status="${semesterOneLockStatus}" data-semesterindex="${semesterOneIndex}" class="card-module-item"
                    ${moduleOne ? `style="--primary-color: ${hexToRGB(moduleOne.category?.primaryColor ?? '#cccccc')}; --accent-color: ${hexToRGB(moduleOne.category?.accentColor ?? '#999999')};"` : 'type="empty"'}>
                    <input name="choice[${yearIndex + 1}][1]" hidden/>
                    <div style="display: flex; justify-content: space-between;">
                        <i class="ph ${statusIconMap[semesterOneLockStatus]}"></i>
                        
                        ${moduleOne ? createModuleInfoThing(moduleOne) : ''}
                    </div>
                    <div style="position: absolute; bottom: 5px; right: 10px;">
                    ${semesterOne.errors ? /*html*/`
                        <x-dialog id="newStudyRouteDialog" closable>
                            
                            <div>
                                ${semesterOne.errors.map(error => /*html*/`<div style="color: rgb(var(--color-black)); text-align: left; white-space: pre-wrap;">${error}</div>`).join('</br>')}
                            </div>

                            
                            <x-tooltip position="left" slot="trigger">
                                <div slot="trigger" data-icon><i class="ph ph-x" style="color: red; cursor: pointer;"></i></div>

                                <p style="color: rgb(var(--color-black)); width: 150px;">Module kan hier niet, click voor meer!<p>
                            </x-tooltip>
                        </x-dialog>
                    ` : ''}
                    </div>
                    <p>${moduleOne ? moduleOne.name : `Optie 1`}</p>
                    
                </div>

                
                <div slot="content-2" data-card-module data-index="1" data-status="${semesterTwoLockStatus}" data-semesterindex="${semesterTwoIndex}" class="card-module-item"
                    ${moduleTwo ? `style="--primary-color: ${hexToRGB(moduleTwo.category?.primaryColor ?? '#cccccc')}; --accent-color: ${hexToRGB(moduleTwo.category?.accentColor ?? '#999999')};"` : 'type="empty"'}>
                    <input name="choice[${yearIndex + 1}][2]" hidden/>
                    <div style="display: flex; justify-content: space-between;">
                        <i class="ph ${statusIconMap[semesterTwoLockStatus]}"></i>

                        ${moduleTwo ? createModuleInfoThing(moduleTwo) : ''}
                    </div>
                    <div style="position: absolute; bottom: 5px; right: 10px;">
                    ${semesterTwo.errors ? /*html*/`
                        <x-dialog id="newStudyRouteDialog" closable>
                            
                            <div>
                                ${semesterTwo.errors.map(error => /*html*/`<div style="color: rgb(var(--color-black)); text-align: left; white-space: pre-wrap;">${error}</div>`).join('</br>')}
                            </div>

                            
                            <x-tooltip position="left" slot="trigger">
                                <div slot="trigger" data-icon><i class="ph ph-x" style="color: red; cursor: pointer;"></i></div>

                                <p style="color: rgb(var(--color-black)); width: 150px;">Module kan hier niet, click voor meer!<p>
                            </x-tooltip>
                        </x-dialog>                      
                    ` : ''}
                    </div>                    

                    <p>${moduleTwo ? moduleTwo.name : `Optie 2`}</p>
                </div>
            </x-study-card>
        `
    }
}

function createModuleInfoThing(module) {
    const isCustom = module instanceof CustomModule || module.isCustom === true;

    return `
      <div class="info-icon" style="cursor: pointer;" data-guid="${module.id}" data-type="${isCustom ? 'custom' : 'standard'}">
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
            })()
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

        const overigCat = categories.find(c => c.value === 'Overig')
        if (overigCat) {
            const eigenKeuze = new CustomModule({
                id: crypto.randomUUID(),
                name: 'Eigen keuze',
                description: 'Hier kan je een eigen keuze toevoegen',
                ec: 30,
                semester: null
            })
            moduleData.get(overigCat).unshift(eigenKeuze)
        } else {
            console.warn(`Category 'Overig' not found; placeholder Eigen keuze not added`)
        }

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
                (module, index) => {
                    if (!module.required) {
                        return `
                        <div class="module-item" data-index="${index}" data-guid="${module.id}">
                            <span>${module.name}</span>
                            ${module.description
                                ? `<div class="info-icon" style="cursor: pointer;" data-guid="${module.id}" data-type="${module instanceof CustomModule || module.isCustom ? 'custom' : 'standard'}">
                                <i class="ph ph-info"></i>
                            </div>`
                                : ''
                            }
                        </div>`
                    }
                }
            ).join('')}
                </x-accordion>
            `
        )
        .join('')

    containers.forEach(container => {
        if (container) {
            container.innerHTML = accordionHTML
        }
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

export default function PlannerPage({ params }) {
    studyRouteId = params?.uuid ?? null

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

                    <button popover-action type="button" class="text-sm" id="export-btn">
                        <i class="ph-duotone ph-download"></i>Save as PDF
                    </button>
                </x-popover>
            </div>
        </div>
    `
}

// TODO: does not work nice with more than 4 years...
function exportStudyRouteToPDF() {
    const container = document.getElementById('study-cards-container');
    const connections = document.getElementById('connection-svg');

    // Store original styles
    const originalStyle = container.getAttribute('style');
    const originalStyleConnections = connections.getAttribute('style');
    // Hide connections before export
    if (connections) {
        connections.style.display = 'none';
    }

    // Expand fully
    container.style.overflow = 'visible';
    container.style.maxHeight = 'none';
    container.style.height = 'auto';

    const opt = {
        margin: 0.5,
        filename: 'studyroute.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(container).save().then(() => {
        // Restore original style afterwards
        container.setAttribute('style', originalStyle || '');
        // Hide connections before export
        if (connections) {
            connections.setAttribute('style', originalStyleConnections || '');
        }
    });
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

        // Get semester for the acquiredECs
        const semesterIndex = selectedSemester.dataset.semesterindex

        const acquiredECs = studyRoute.semesters[semesterIndex].acquiredECs
        console.log(studyRoute.semesters[semesterIndex])

        modal.setOnSaveCallback(async (updatedModule) => {
            const semesterIndex = selectedSemester.dataset.semesterindex
            const semester = studyRoute.semesters[semesterIndex];

            updatedModule.id ??= studyRoute.semesters[semesterIndex].customModule?.id

            if (semester.module !== null && semester.module !== undefined) {
                // clearly this is a Module
            }
            else {
                // clearly this is a CustomModule
                const newModule = new CustomModule(updatedModule)
                studyRoute.semesters[semesterIndex].customModule = newModule
                studyRoute.semesters[semesterIndex].customModuleId = newModule.id
                studyRoute.semesters[semesterIndex].module = null
                studyRoute.semesters[semesterIndex].moduleId = null
            }

            studyRoute.semesters[semesterIndex].acquiredECs = updatedModule.acquiredECs

            saveRoute()
        })

        modal.open(module, isCustom, acquiredECs)
    })

    window.addEventListener('resize', () => {
        requestAnimationFrame(drawConnections)
    })

    document.querySelector('#export-btn').addEventListener('click', exportStudyRouteToPDF)

    loadModules().catch(console.error)
    await loadStudyRoute()
    saveRoute()
}
