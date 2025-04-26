import '@components/save-button'
import '@components/studyCard/studyCard.js'
import '@components/studyCard/studyCard.css'


function addAccordionEventListeners() {
    const accordionItems = document.querySelectorAll('.module-item');

    accordionItems.forEach(item => {

        item.removeEventListener('click', accordionClickHandler);

        item.addEventListener('click', accordionClickHandler);
    });
}


function accordionClickHandler(event) {
    const selectedContent = event.target.textContent.trim();
    let foundSelectedSemester = false;

    const studyCards = document.querySelectorAll('study-card');

    studyCards.forEach(studyCard => {
        if (studyCard.shadowRoot) {
            const shadowSemesters = studyCard.shadowRoot.querySelectorAll('.semester');

            shadowSemesters.forEach(shadowDiv => {
                if (shadowDiv.classList.contains('selected-semester')) {
                    const textWrapper = shadowDiv.querySelector('p');
                    if (textWrapper) {
                        textWrapper.textContent = selectedContent;
                    }

                    const accordionColor = window.getComputedStyle(event.target.parentElement)
                        .getPropertyValue('--accordion-active-bg-color')
                        .trim();

                    shadowDiv.style.backgroundColor = accordionColor;
                    shadowDiv.style.borderColor = accordionColor;

                    foundSelectedSemester = true;
                }
            });
        }
    });

    if (!foundSelectedSemester) {
    }
}

function addSemesterEventListeners() {
    const studyCards = document.querySelectorAll('study-card');

    studyCards.forEach(card => {
        if (card.shadowRoot) {
            const semesters = card.shadowRoot.querySelectorAll('.semester');

            semesters.forEach(semester => {
                semester.removeEventListener('click', semesterClickHandler);
                semester.addEventListener('click', semesterClickHandler);
            });
        }
    });
}


function semesterClickHandler(event) {
    console.log('Semester clicked:', event.target.textContent.trim());
    const studyCards = document.querySelectorAll('study-card');

    studyCards.forEach(card => {
        if (card.shadowRoot) {
            const semesters = card.shadowRoot.querySelectorAll('.semester');
            semesters.forEach(semester => {
                semester.classList.remove('selected-semester'); // Reset selectie
            });
        }
    });

    const semester = event.target;
    if (semester.classList.contains('unlocked')) {
        semester.classList.add('selected-semester');
    }
}


function addStudyCard(year, semester1Title, semester1Content, semester1Status, semester2Title, semester2Content, semester2Status) {
    return `
        <study-card>
            <span slot="year-header">${year}</span>
            <span slot="semester-1-title">${semester1Title}</span>
            <span id="semester-1-content-${year}" slot="semester-1-content" data-status="${semester1Status}">${semester1Content}</span>
            <span slot="semester-2-title">${semester2Title}</span>
            <span id="semester-2-content-${year}" slot="semester-2-content" data-status="${semester2Status}">${semester2Content}</span>
        </study-card>
    `;
}
export default function PlannerPage(params) {
    PlannerPage.onPageLoaded = () => {
        addAccordionEventListeners();
        addSemesterEventListeners();
    }
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
            <div class="study-cards-container">
        ${addStudyCard('Jaar 1', 'Semester 1', 'Basisconcepten ICT 1', 'locked', 'Semester 2', 'Basisconcepten ICT 2', 'locked')}
        ${addStudyCard('Jaar 2', 'Semester 1', 'Keuze 1', 'unlocked', 'Semester 2', 'Keuze 2', 'unlocked')}
        ${addStudyCard('Jaar 3', 'Semester 1', 'Keuze 1', 'unlocked', 'Semester 2', 'Keuze 2', 'unlocked')}
        ${addStudyCard('Jaar 4', 'Semester 1', 'Keuze 1', 'unlocked', 'Semester 2', 'Keuze 2', 'unlocked')}
    </div> 
            <save-share-button>
                <span slot="icon">Opslaan</span>
            </save-share-button>
        </div>


  `
}
