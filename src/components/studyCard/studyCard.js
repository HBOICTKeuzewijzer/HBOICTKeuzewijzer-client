import styles from './studyCard.css?inline';


class StudyCard extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        shadow.innerHTML = `
      <style>${styles}</style>
      <div class="study-year">
        <div class="year-header">
          <slot name="year-header">Year Header</slot>
        </div>
        
        <h4 class="semester-title"><slot name="semester-1-title">Semester 1</slot></h4>
        <div class="semester semester-1">
          <p><slot name="semester-1-content"></slot></p>
        </div>

        <h4 class="semester-title"><slot name="semester-2-title">Semester 2</slot></h4>
        <div class="semester semester-2">
          <p><slot name="semester-2-content"></slot></p>
        </div>
      </div>
    `;
    }

    connectedCallback() {
        this.updateSemesterStyles();
    }

    updateSemesterStyles() {
        const semesters = this.shadowRoot.querySelectorAll('.semester');
        semesters.forEach((semester, index) => {
            // Update op basis van de status
            const slotContent = this.querySelector(`[slot="semester-${index + 1}-content"]`);
            const status = slotContent?.getAttribute('data-status') || 'unlocked';

            // Maak de SVG voor de slot-iconen
            const lockedIconSVG = `
            <svg class="lock-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                <path d="M208,96H184V68a56,56,0,0,0-112,0V96H48A16,16,0,0,0,32,112V216a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V112A16,16,0,0,0,208,96ZM88,68a40,40,0,0,1,80,0V96H88Z"></path>
            </svg>
        `;

            const unlockedIconSVG = `
            <svg class="lock-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                <path d="M208,96H184V72a56,56,0,0,0-112,0,8,8,0,0,0,16,0,40,40,0,0,1,80,0V96H48A16,16,0,0,0,32,112V216a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V112A16,16,0,0,0,208,96Zm0,120H48V112H208V216Z"/>
            </svg>
        `;

            const iconSVG = status === 'locked' ? lockedIconSVG : unlockedIconSVG;


            semester.innerHTML = iconSVG + semester.innerHTML;


            if (status === 'locked') {
                semester.classList.add('locked');
                semester.classList.remove('unlocked');
            } else {
                semester.classList.add('unlocked');
                semester.classList.remove('locked');
            }
        });
    }
}

customElements.define('study-card', StudyCard);