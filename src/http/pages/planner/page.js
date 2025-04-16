import '@components/accordion';
import '../../../components/studyCard/studyCard.js';
import '@components/studyCard/studyCard.css';


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
function observeDOMChanges() {
    const observer = new MutationObserver(() => {
        addAccordionEventListeners();
        addSemesterEventListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Initialisatie
addAccordionEventListeners();
addSemesterEventListeners();
observeDOMChanges();
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
    setTimeout(() => {
        addAccordionEventListeners();
        addSemesterEventListeners();
        observeDOMChanges();
    }, 0);


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

    <div class="study-cards-container">
        ${addStudyCard('Jaar 1', 'Semester 1', 'Basisconcepten ICT 1', 'locked','Semester 2', 'Basisconcepten ICT 2', 'locked')}
        ${addStudyCard('Jaar 2', 'Semester 1', 'Keuze 1', 'unlocked','Semester 2', 'Keuze 2', 'unlocked')}
        ${addStudyCard('Jaar 3', 'Semester 1', 'Keuze 1', 'unlocked', 'Semester 2', 'Keuze 2', 'unlocked')}
        ${addStudyCard('Jaar 4', 'Semester 1', 'Keuze 1', 'unlocked', 'Semester 2', 'Keuze 2', 'unlocked')}
    </div>
    `;
}
