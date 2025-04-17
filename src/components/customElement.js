export default class CustomElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    #eventListeners = [];

    /**
     * Apply a <template> to the shadow root.
     * @param {HTMLTemplateElement} template The template element to clone and set.
     */
    applyTemplate(template) {
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    /**
     * Hides <slot> that have not received content.
     */
    hideEmptySlots() {
        const slots = this.shadowRoot.querySelectorAll('slot');

        slots.forEach(slot => {
            if (slot.assignedNodes().length === 0) {
                slot.style.display = 'none';
            } else {
                slot.style.display = '';
            }
        });
    }

    /**
     * Add a listener that will be tracked so that it is easy to remove with clearListeners().
     * 
     * Note things like this will not work:
     * this.trackListener(btn, "click", event => {
     *     if (typeof callback === "function") {
     *         callback(record);
     *     }
     * });
     * 
     * You always need a named reference like so:
     * const handler = (event) => {};
     * this.trackListener(btn, "click", handler);
     *
     * @param {HTMLElement} element 
     * @param {string} event 
     * @param {(event: Event) => void} handler
     */
    trackListener(element, event, handler) {
        element.addEventListener(event, handler);
        this.#eventListeners.push({ element, event, handler });
    }

    /**
     * Clears all tracked listeners
     */
    clearListeners() {
        for (const { element, type, handler } of this.#eventListeners) {
            element.removeEventListener(type, handler);
        }
        this.#eventListeners = [];
    }
}