import styling from './style.css?raw'

export class ModulesHeader extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' })
  
      this.shadowRoot.innerHTML = `
        <style>${styling}</style>
      
        <div class="page-wrapper">
          <div class="header">
            <div class="text-group">
              <h1>Modules beheren</h1>
              <p>Bekijk hier een overzicht van alle modules. Hier kan je modules toevoegen en verwijderen</p>
            </div>
            <button class="add-button">Module toevoegen</button>
          </div>
        </div>
      `;
    }
  }