class Sidebar extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                @import url("sidebar.css");
            </style>
           
        `;
    
        shadow.appendChild(template.content.cloneNode(true));
        
    }
}

// Gebruik een naam MET STREEPJE
customElements.define('app-sidebar', Sidebar);  // Nu werkt het wel!