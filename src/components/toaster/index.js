import styles from './style.css?inline'

export class AppToaster extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.timeoutId = null;

        this.shadowRoot.innerHTML = `
                    <style>${styles}</style>
            <div class="toaster hidden" id="toast"></div>
        `;
    }

    show(message = 'Er is een melding!') {
        const toast = this.shadowRoot.getElementById('toast');
        toast.textContent = message;
        toast.classList.remove('hidden');
        toast.classList.add('visible');

        clearTimeout(this.timeoutId);

        this.timeoutId = setTimeout(() => {
            toast.classList.remove('visible');
            toast.classList.add('hidden');
        }, 5000);
    }
}

customElements.define('app-toaster', AppToaster);
