import styles from './studyCard.css?inline';
import './semester.js';
import './yearHeader.js';

class StudyCard extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        shadow.innerHTML = `
      <style>${styles}</style>
      <div class="study-year">
        <year-header>
          <slot name="year-header">Year Header</slot>
        </year-header>
        
        <h4 class="semester-title"><slot name="semester-1-title">Semester 1</slot></h4>
        <slot name="semester-1-content"></slot>

        <h4 class="semester-title"><slot name="semester-2-title">Semester 2</slot></h4>
        <slot name="semester-2-content"></slot>
      </div>
    `;
    }
}

customElements.define('study-card', StudyCard);
