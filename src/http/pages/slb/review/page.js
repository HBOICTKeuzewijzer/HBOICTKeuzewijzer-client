import { fetcher } from '@/utils'
import { Module, Category, Semester, StudyRoute } from '@/models'

let studyRouteId = null

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
        let semesterOneLockStatus = semesterOne.module?.required ?? false ? "locked" : "unlocked"
        let semesterTwoLockStatus = semesterTwo.module?.required ?? false ? "locked" : "unlocked"

        container.innerHTML += /*html*/`
            <x-study-card data-year="${yearIndex}">
                <span slot="header">Jaar ${yearIndex + 1}</span>
                <div slot="content-1" data-card-module data-index="0" data-status="${semesterOneLockStatus}" data-semesterindex="${semesterOneIndex}" class="card-module-item"
                    ${semesterOne.module ? `style="--primary-color: ${hexToRGB(semesterOne.module.category?.primaryColor)}; --accent-color: ${hexToRGB(semesterOne.module.category?.accentColor)};"` : 'type="empty"'}>
                    <input name="choice[${yearIndex + 1}][1]" hidden/>
                    <div style="display: flex; justify-content: space-between;">
                        <i class="ph ${statusIconMap[semesterOneLockStatus]}"></i>
                        ${semesterOne.module && semesterOne.module.description ? /*html*/`
                        <x-tooltip>
                            <div slot="trigger" data-icon><i class="ph ph-info"></i></div>
                            <p style="color: rgb(var(--color-black));">${semesterOne.module.description}</p>
                        </x-tooltip>    
                        ` : ''}
                    </div>
                    ${semesterOne.module ? semesterOne.module.name : `Optie 1`}
                </div>

                
                <div slot="content-2" data-card-module data-index="1" data-status="${semesterTwoLockStatus}" data-semesterindex="${semesterTwoIndex}" class="card-module-item"
                    ${semesterTwo.module ? `style="--primary-color: ${hexToRGB(semesterTwo.module.category?.primaryColor)}; --accent-color: ${hexToRGB(semesterTwo.module.category?.accentColor)};"` : 'type="empty"'}>
                    <input name="choice[${yearIndex + 1}][2]" hidden/>
                    <div style="display: flex; justify-content: space-between;">
                        <i class="ph ${statusIconMap[semesterTwoLockStatus]}"></i>
                        ${semesterTwo.module && semesterTwo.module.description ? /*html*/`
                        <x-tooltip>
                            <div slot="trigger" data-icon><i class="ph ph-info"></i></div>
                            <p style="color: rgb(var(--color-black));">${semesterTwo.module.description}</p>
                        </x-tooltip>    
                        ` : ''}
                    </div>
                    ${semesterTwo.module ? semesterTwo.module.name : `Optie 2`}
                </div>
            </x-study-card>
        `
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

PlannerPage.onPageLoaded = async () => {
    window.addEventListener('resize', () => {
        requestAnimationFrame(drawConnections)
    })

    await loadStudyRoute()
    renderStudyCards()
    drawConnections()
}
