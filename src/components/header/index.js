import { html } from "@/utils";
import CustomElement from "../customElement";
import styling from "./style.css?raw"
import { router } from "@/http/router";

const template = html`
    <style>${styling}</style>
    <header>
        <a id="home" href="/">
            <slot name="logo"></slot>
        </a>
        <div class="header-routes-container">
            <div class="header-routes">
                <slot name="links"></slot>
                
                <div class="profile-slot">
                    <slot name="profile"></slot>
                </div>
            </div>
        
            <button id="mob-toggle">
                <slot name="mob-icon"></slot>
            </button>
        </div>
    </header>
`


export class Header extends CustomElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.applyTemplate(template)

        this.trackListener(this.root.querySelector('#mob-toggle'), 'click', this.#toggle.bind(this))

        this.trackListener(this, 'onNavigating', this.#toggle.bind(this))

        this.trackListener(this.root.querySelector('#home'), 'click', this.#onLinkClicked.bind(this))
    }

    disconnectedCallback() {
        this.clearListeners()
    }

    #onLinkClicked(e) {
        e.preventDefault()

        router.navigate('/')

        this.#toggle()
    }

    #toggle() {
        this.root.querySelector('.header-routes').classList.toggle('open')
    }
}