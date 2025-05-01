export default class CustomElement extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    #eventListeners = []

    /**
     * Apply a <template> to the shadow root.
     * @param {HTMLTemplateElement} template The template element to clone and set.
     */
    applyTemplate(template) {
        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }

    /**
     * Hides <slot> that have not received content.
     */
    hideEmptySlots() {
        const slots = this.shadowRoot.querySelectorAll('slot')

        slots.forEach(slot => {
            if (slot.assignedNodes().length === 0) {
                slot.style.display = 'none'
            } else {
                slot.style.display = ''
            }
        })
    }

    /**
     * Add a listener that will be tracked so that it is easy to remove with clearListeners().
     * @param {HTMLElement} element 
     * @param {string} event 
 
    /**
     * Add a listener that will be tracked so that it is easy to remove with clearListeners().
     * @param {HTMLElement} element
     * @param {string} event
     * @param {(event: Event) => void} handler
     */
    trackListener(element, event, handler) {
        element.addEventListener(event, handler)
        this.#eventListeners.push({ element, event, handler })
    }

    /**
     * Clears all tracked listeners
     */
    clearListeners() {
        for (const { element, event, handler } of this.#eventListeners) {
            element.removeEventListener(event, handler)
        }
        this.#eventListeners = []
    }

    /**
     * @returns {ShadowRoot} Shadowroot root
     */
    get root() {
        return this.shadowRoot
    }
}
