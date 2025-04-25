import { Openable, AriaReflector } from '@traits'
import { composeTraits } from '@utils'
import template from './template.html?raw'
import styling from './style.css?raw'

// Create and attach the component's shadow DOM template
const _template = document.createElement('template')
_template.innerHTML = `
    <style>${styling}</style>
    ${template}
`

/**
 * <x-drawer>
 *
 * A Web Component representing a slide-in drawer interface.
 * Supports show/hide states, accessibility attributes, and optional drag-to-close behavior.
 *
 * Attributes:
 * - `open`     : Boolean - toggles visibility of the drawer.
 * - `disabled` : Boolean - disables user interactions.
 *
 * Properties:
 * - `open`     : Boolean - programmatically controls the drawer's open state.
 * - `disabled` : Boolean - programmatically disables interactions.
 *
 * Example:
 * ```html
 * <x-drawer open>
 *   <div>Drawer content here</div>
 * </x-drawer>
 * ```
 */
export class Drawer extends composeTraits(HTMLElement, Openable, AriaReflector) {
    /** @type {HTMLElement | null} */
    contentElement = null
    /** @type {HTMLElement | null} */
    backdropElement = null
    /** @type {HTMLElement | null} */
    triggerElement = null
    /** @type {HTMLElement | null} */
    handleElement = null

    /** Drag state variables */
    #dragOffsetY = 0
    #startY = 0
    #initialTop = 0
    #dragging = false

    /** Event listeners for drag functionality */
    #onMouseMove = null
    #onMouseUp = null
    #onTouchMove = null
    #onTouchEnd = null
    #dragThreshold = 400

    constructor() {
        super()

        this.attachShadow({ mode: 'open' }).appendChild(_template.content.cloneNode(true))

        this.#onMouseMove = this.#dragMove.bind(this)
        this.#onMouseUp = this.#stopDrag.bind(this)
        this.#onTouchMove = this.#dragMove.bind(this)
        this.#onTouchEnd = this.#stopDrag.bind(this)
    }

    /**
     * Specifies the observed attributes for the component.
     * @returns {string[]} List of attributes to observe.
     */
    static get observedAttributes() {
        return ['open', 'disabled']
    }

    /**
     * Lifecycle method triggered when the component is added to the DOM.
     */
    connectedCallback() {
        this.triggerElement = this.querySelector('[slot="trigger"]')
        this.contentElement = this.shadowRoot?.querySelector('[data-drawer]')
        this.backdropElement = this.shadowRoot?.querySelector('[data-backdrop]')
        this.handleElement = this.shadowRoot?.querySelector('[data-handle]')

        this.triggerElement?.addEventListener('click', this._toggleHandler)

        // Dragging Functionality
        this.handleElement?.addEventListener('mousedown', this.#startDrag.bind(this))
        this.handleElement?.addEventListener('touchstart', this.#startDrag.bind(this), { passive: true })
    }

    /**
     * Lifecycle method triggered when the component is removed from the DOM.
     */
    disconnectedCallback() {
        this.triggerElement?.removeEventListener('click', this._toggleHandler)

        // Dragging Functionality
        this.handleElement?.removeEventListener('mousedown', this.#startDrag.bind(this))
        this.handleElement?.removeEventListener('touchstart', this.#startDrag.bind(this), { passive: false })
    }

    /**
     * Called when an observed attribute is changed.
     * @param {string} name - The name of the attribute that changed.
     * @param {string | null} oldValue - The previous value of the attribute.
     * @param {string | null} newValue - The new value of the attribute.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue !== oldValue) {
            if (name === 'open') {
                if (newValue) this.contentElement.style.top = ''
                this.contentElement?.setAttribute('aria-hidden', !this.open)
            }
        }
    }

    /**
     * Initiates dragging when the handle element is clicked.
     * @param {MouseEvent | TouchEvent} event - The mouse or touch event.
     */
    #startDrag(event) {
        if (!this.contentElement || this.disabled || this.#dragging) return
        this.handleElement?.setAttribute('aria-grabbed', true)

        const rect = this.contentElement.getBoundingClientRect()
        const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0]?.clientY
        this.#initialTop = rect.top

        if (clientY !== undefined) {
            this.#startY = clientY
            this.#dragOffsetY = clientY - rect.top

            // Indicate the element is being dragged
            this.handleElement?.setAttribute('aria-grabbed', 'true')
            this.#dragging = true

            // Add event listeners for mouse/touch movement
            document.addEventListener('mousemove', this.#onMouseMove)
            document.addEventListener('mouseup', this.#onMouseUp)
            document.addEventListener('touchmove', this.#onTouchMove)
            document.addEventListener('touchend', this.#onTouchEnd)
        }
    }

    /**
     * Handles the movement of the drawer while dragging.
     * @param {MouseEvent | TouchEvent} event - The mouse or touch event.
     */
    #dragMove(event) {
        if (!this.contentElement) return

        const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0]?.clientY
        if (clientY !== undefined) {
            const offsetY = clientY - this.#dragOffsetY
            if (offsetY > 0) {
                event.preventDefault()
                this.contentElement.style.top = `${offsetY}px`
            }
        }
    }

    /**
     * Stops the drag and checks if the drawer should be hidden or snapped back.
     */
    #stopDrag() {
        document.removeEventListener('mousemove', this.#onMouseMove)
        document.removeEventListener('mouseup', this.#onMouseUp)
        document.removeEventListener('touchmove', this.#onTouchMove)
        document.removeEventListener('touchend', this.#onTouchEnd)

        const rect = this.contentElement.getBoundingClientRect()
        if (rect.top > this.#dragThreshold) {
            this.open = false // Hide the drawer if the threshold is exceeded
        } else {
            this.#snapBack() // Snap back if not dragged far enough
        }

        // Reset ARIA grabbed state
        this.handleElement?.setAttribute('aria-grabbed', 'false')
        this.#dragging = false
    }

    /**
     * Smoothly snaps the drawer back to its initial position.
     */
    #snapBack() {
        this.contentElement.style.transition = 'top 0.3s ease-out'
        this.contentElement.style.top = `${this.#initialTop}px`

        setTimeout(() => {
            this.contentElement.style.transition = '' // Reset transition after snapping back
        }, 300)
    }
}