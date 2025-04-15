export default class CustomElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    applyTemplate(template) {
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    clearEmptySlots() {
        const slots = this.shadowRoot.querySelectorAll('slot');

        slots.forEach(slot => {
            if (slot.assignedNodes().length === 0) {
                slot.style.display = 'none';
            } else {
                slot.style.display = '';
            }
        });
    }
}