class StudyCard extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        shadow.innerHTML = `
      <style>
        .study-year {
          display: grid;
          grid-template-rows: auto auto;
          background-color: #f9f9f9;
          border-radius: 12px;
          padding: 24px;
          width: 260px;
          font-family: sans-serif;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          position: relative;
          margin: 20px;
        }

        .year-header {
          font-weight: bold;
          font-size: 16px;
          color: #555;
          margin-bottom: 12px;
          text-align: center;
        }

        .semester-title {
          font-size: 14px;
          margin: 0 0 8px 0;
          color: #333;
          text-align: center;
        }

        .semester {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 16px; 
          margin-top: 12px; 
          border: 2px solid #e0e0e0;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .semester.locked {
          background-color: #ffd500;
          border: 2px solid #d8b400;
        }

        .semester.locked::before {
          content: '[LOCKED]'; /* Text representation for locked state */
          position: absolute;
          left: 8px;
          top: 8px;
          font-size: 12px;
          color: #888;
          font-weight: bold;
        }

        .semester.keuze-dotted {
          border: 2px dashed #ffa500;
          background-color: #fff8e1;
          font-style: italic;
        }

        .semester p {
          font-size: 13px;
          color: #666;
          margin: 0;
          text-align: center;
        }



      </style>

      <div class="study-year">
        <div class="year-header">
          <slot name="year-header">Year Header</slot>
        </div>
        
        <h4 class="semester-title"><slot name="semester-1-title">Semester 1</slot></h4>
        <div class="semester" id="semester-1">
          <p><slot name="semester-1-content">Content for Semester 1</slot></p>
        </div>
        
        <h4 class="semester-title"><slot name="semester-2-title">Semester 2</slot></h4>
        <div class="semester" id="semester-2">
          <p><slot name="semester-2-content">Content for Semester 2</slot></p>
        </div>
      </div>
    `;

        this.updateSemesterStyles();
    }

    updateSemesterStyles() {
        const semester1 = this.shadowRoot.querySelector('#semester-1');
        const semester2 = this.shadowRoot.querySelector('#semester-2');

        // Check content for Semester 1
        const semester1Content = this.querySelector('[slot="semester-1-content"]')?.textContent.trim();
        if (semester1Content && semester1Content.toLowerCase().includes('basisconcepten')) {
            semester1.classList.add('locked');
        } else {
            semester1.classList.add('keuze-dotted');
        }

        // Check content for Semester 2
        const semester2Content = this.querySelector('[slot="semester-2-content"]')?.textContent.trim();
        if (semester2Content && semester2Content.toLowerCase().includes('basisconcepten')) {
            semester2.classList.add('locked');
        } else {
            semester2.classList.add('keuze-dotted');
        }
    }
}

customElements.define('study-card', StudyCard);
