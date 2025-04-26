import styles from './accordion.css?inline'

export class Accordion extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })

        this.shadowRoot.innerHTML = /*html*/ `
          <style>${styles}</style>
          <button data-accordion tabindex="0" aria-expanded="false">
            <div class="circle"></div>
            <slot name="title"></slot>
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
              <path d="M200,136H136v64a8,8,0,0,1-16,0V136H56a8,8,0,0,1,0-16h64V56a8,8,0,0,1,16,0v64h64a8,8,0,0,1,0,16Z"/>
            </svg>
          </button>
          <div data-content>
            <div class="line"></div>
            <div class="content">
              <slot></slot>
            </div>
          </div>
        `

        this._onAccordionClick = this._onAccordionClick.bind(this)
    }

    connectedCallback() {
        this.accordionButton = this.shadowRoot.querySelector('[data-accordion]')
        this.panel = this.shadowRoot.querySelector('[data-content]')
        if (this.accordionButton) {
            this.accordionButton.addEventListener('click', this._onAccordionClick)
        }
    }

    disconnectedCallback() {
        if (this.accordionButton) {
            this.accordionButton.removeEventListener('click', this._onAccordionClick)
        }
    }

    _onAccordionClick(event) {
        const button = event.currentTarget
        const isExpanded = button.classList.toggle('open')

        this.toggleAttribute('open', isExpanded)
        button.setAttribute('aria-expanded', isExpanded)

        if (!this.panel) return

        if (this.panel.style.maxHeight) {
            this.panel.style.removeProperty('max-height')
        } else {
            this.panel.style.maxHeight = this.panel.scrollHeight + 'px'
        }
    }
}
