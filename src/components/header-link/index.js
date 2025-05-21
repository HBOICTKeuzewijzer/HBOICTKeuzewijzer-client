import { Auth, html } from "@/utils"
import CustomElement from "../customElement"
import { router } from "@/http/router"
import styling from "./style.css?raw"

const template = html`
    <style>
        ${styling}
    </style>
    <div class="hover-wrapper">
        <div class="main">
            <a part="link"><slot></slot></a>
            <button class="toggle" aria-label="Toggle dropdown" hidden>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
            </button>
        </div>
        <div class="dropdown">
            <div class="line"></div>
            <div class="content">
                <slot name="dropdown"></slot>
            </div>
        </div>
    </div>
`;

/**
 * `<x-header-link>`
 * 
 * ### Attributes:
 * - `path` - Required. Defines the path the link will navigate to.
 * - `authenticated` - Optional. Controls visibility based on auth state.
 *     - `'true'`: Only visible when logged in
 *     - `'false'`: Only visible when logged out
 *     - `'shown'`: Always visible, even if not logged in
 * - `roles` - Optional. JSON array of required roles (e.g., '["admin", "editor"]').
 *     Visible only if the logged-in user has one of these roles.
 */
export class HeaderLink extends CustomElement {
    static get observedAttributes() {
        return ['roles', 'authenticated', 'path']
    }

    constructor() {
        super()
    }

    get roles() {
        const raw = this.getAttribute('roles');
        if (!raw) return null;

        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : null;
        } catch {
            console.warn('Invalid role format:', raw);
            return null;
        }
    }


    set roles(value) {
        this.setAttribute('roles', value)
    }

    get authenticated() {
        return this.getAttribute('authenticated')
    }

    set authenticated(value) {
        this.setAttribute('authenticated', value)
    }

    get path() {
        return this.getAttribute('path')
    }

    set path(value) {
        this.setAttribute('path', value)
    }

    connectedCallback() {
        this.applyTemplate(template);

        const showElement = this.#shouldShow()

        if (!showElement) {
            this.style.display = 'none';
            return;
        }

        const link = this.shadowRoot.querySelector('a');
        const toggleBtn = this.shadowRoot.querySelector('.toggle');

        if (this.path) {
            link.setAttribute('href', this.path);
            this.trackListener(link, 'click', this.#onLinkClicked);
        }

        // If dropdown exists, show toggle button
        if (this.querySelector('[slot="dropdown"]')) {
            this.classList.add('has-dropdown');
            toggleBtn.hidden = false;

            this.trackListener(toggleBtn, 'click', () => {
                this.classList.toggle('open');
            });

            this.trackListener(document, 'click', (e) => {
                if (!this.contains(e.target)) {
                    this.classList.remove('open');
                }
            });
        }
    }

    disconnectedCallback() {
        this.clearListeners()
    }

    #shouldShow() {
        const isLoggedIn = Auth.isLoggedIn();
        const authAttr = (this.getAttribute('authenticated') || '').toLowerCase();

        // Handle auth filtering
        if (authAttr === 'true' && !isLoggedIn) return false;
        if (authAttr === 'false' && !isLoggedIn) return true;
        if (authAttr === 'false' && isLoggedIn) return false;
        if (authAttr === 'shown') return true;

        const roles = this.roles;

        if (roles !== null) {
            if (!isLoggedIn) return false;

            let user = Auth.getUser();

            if (user === null) return false;

            // Empty role array means "show to no one"
            if (roles.length === 0) return false;

            return roles.some(role => user.hasRole(role));
        }

        return true;
    }

    #onLinkClicked = (e) => {
        e.preventDefault()

        this.dispatchEvent(new CustomEvent('onNavigating', {
            bubbles: true,
            composed: true,
            detail: { path: this.path }
        }));

        router.navigate(this.path)
    }
}