import '@components/accordion';
import '@components/studyCard/studyCard.js';

function addAccordionEventListeners() {
    const accordionItems = document.querySelectorAll('.module-item');

    // Delegate the event handling to the parent custom-accordion
    accordionItems.forEach(item => {
        item.addEventListener('click', (event) => {
            const selectedContent = event.target.textContent.trim();
            const selectedSemester = document.querySelector('.selected-semester');

            if (selectedSemester) {
                selectedSemester.textContent = selectedContent;
                selectedSemester.classList.remove('selected-semester');

                // Get the accordion highlight color
                const accordionColor = window.getComputedStyle(item.parentElement)
                    .getPropertyValue('--accordion-active-bg-color').trim();

                // Access shadow DOM
                if (selectedSemester.tagName.toLowerCase() === 'study-semester' && selectedSemester.shadowRoot) {
                    const shadowDiv = selectedSemester.shadowRoot.querySelector('.semester');
                    if (shadowDiv) {
                        // Remove old style classes
                        shadowDiv.classList.remove('keuze-dotted', 'locked');

                        shadowDiv.classList.add('updated-semester');

                        // Set colors dynamically
                        shadowDiv.style.backgroundColor = accordionColor;
                        shadowDiv.style.borderColor = accordionColor;
                    }
                }
            }
        });
    });
}

// Function to handle semester item selection
function addSemesterEventListeners() {
    const semesterContents = document.querySelectorAll('[id^="semester-"]');
    semesterContents.forEach(content => {
        content.addEventListener('click', (event) => {
            semesterContents.forEach(c => c.classList.remove('selected-semester'));
            event.target.classList.add('selected-semester');
        });
    });
}

function observeDOMChanges() {
    const observer = new MutationObserver(() => {
        addAccordionEventListeners();
        addSemesterEventListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function addStudyCard(year, semester1Title, semester1Content, semester2Title, semester2Content) {
    return `
        <study-card>
            <span slot="year-header">${year}</span>
            <span slot="semester-1-title">${semester1Title}</span>
            <study-semester id="semester-1-content-${year}" slot="semester-1-content">${semester1Content}</study-semester>
            <span slot="semester-2-title">${semester2Title}</span>
            <study-semester id="semester-2-content-${year}" slot="semester-2-content">${semester2Content}</study-semester>
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
                        <p style="padding-top: 12px; padding-bottom: 12px; margin-left: 10px;">Webdevelopment</p>
                    </div>
                    <div class="module-item" slot="content">
                        <p style="padding-top: 12px; padding-bottom: 12px; margin-left: 10px;">Software Engineering</p>
                    </div>
                </custom-accordion>
                <custom-accordion style="--accordion-active-bg-color: rgb(var(--color-light-blue)); --accordion-bg-color: #f1f1f1; --circle-color: rgb(var(--color-sky-blue));">
                    <span slot="title">Infrastructure Design & Security</span>
                    <div class="module-item" slot="content">
                        <p style="padding-top: 12px; padding-bottom: 12px; margin-left: 10px;">Applied IT Security</p>
                    </div>
                    <div class="module-item" slot="content">
                        <p style="padding-top: 12px; padding-bottom: 12px; margin-left: 10px;">Cloud Computing</p>
                    </div>
                </custom-accordion>
                <custom-accordion style="--accordion-active-bg-color: rgb(var(--color-apple-green)); --accordion-bg-color: #f1f1f1; --circle-color: rgb(var(--color-dark-green));">
                    <span slot="title">Business IT & Management</span>
                    <div class="module-item" slot="content">
                        <p style="padding-top: 12px; padding-bottom: 12px; margin-left: 10px;">Datascience</p>
                    </div>
                    <div class="module-item" slot="content">
                        <p style="padding-top: 12px; padding-bottom: 12px; margin-left: 10px;">Management of IT</p>
                    </div>
                </custom-accordion>
                <custom-accordion style="--accordion-active-bg-color: #FEDFE4; --accordion-bg-color: #f1f1f1; --circle-color: rgb(var(--color-dark-pink));">
                    <span slot="title">Overig</span>
                    <div class="module-item" slot="content">
                        <p style="padding-top: 12px; padding-bottom: 12px; margin-left: 10px;">Tussen jaar</p>
                    </div>
                    <div class="module-item" slot="content">
                        <p style="padding-top: 12px; padding-bottom: 12px; margin-left: 10px;">Minor</p>
                    </div>
                    <div class="module-item" slot="content">
                        <p style="padding-top: 12px; padding-bottom: 12px; margin-left: 10px;">Eigen Keuze</p>
                    </div>
                </custom-accordion>
            </span>
        </x-sheet>

        <div class="study-cards-container" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; justify-content: center; padding: 20px; margin:auto;">
            ${addStudyCard('Jaar 1', 'Semester 1', 'Basisconcepten ICT 1', 'Semester 2', 'Basisconcepten ICT 2')}
            ${addStudyCard('Jaar 2', 'Semester 1', 'Keuze 1', 'Semester 2', 'Keuze 2')}
            ${addStudyCard('Jaar 3', 'Semester 1', 'Keuze 1', 'Semester 2', 'Keuze 2')}
            ${addStudyCard('Jaar 4', 'Semester 1', 'Keuze 1', 'Semester 2', 'Keuze 2')}
        </div>
    `;
}
