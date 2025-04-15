import style from './style.css?inline';

const template = document.createElement('template');
template.innerHTML = /*html*/`
  <style>${style}</style>
  <button>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
      <path d="M219.31,72,184,36.69A15.86,15.86,0,0,0,172.69,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V83.31A15.86,15.86,0,0,0,219.31,72ZM168,208H88V152h80Zm40,0H184V152a16,16,0,0,0-16-16H88a16,16,0,0,0-16,16v56H48V48H172.69L208,83.31ZM160,72a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h56A8,8,0,0,1,160,72Z"/>
    </svg>
    Opslaan
  </button>
`;

class SaveShareButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.shadowRoot.querySelector('button').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('saveshare', {
        bubbles: true,
        composed: true,
        detail: { timestamp: new Date() }
      }));

      if (navigator.share) {
        navigator.share({
          title: 'Mijn planning',
          text: 'Bekijk mijn moduleplanning',
          url: window.location.href
        }).catch(err => console.warn('Delen geannuleerd of mislukt:', err));
      } else {
        alert('Deel deze pagina met CTRL+C of via de browser');
      }
    });
  }
}

customElements.define('save-share-button', SaveShareButton);
