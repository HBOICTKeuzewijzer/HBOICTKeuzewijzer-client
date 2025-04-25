export const AriaReflector = Base => class extends Base {
    static get observedAttributes() {
        return [
            ...AriaReflector(super.observedAttributes || []),
        ]
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback?.(name, oldValue, newValue)
        this._reflectAriaState(name)
    }

    connectedCallback() {
        super.connectedCallback?.();
        this._reflectAllAriaStates();
      }
    
      _reflectAllAriaStates() {
        ['disabled', 'open', 'toggled', 'pressed'].forEach(attr => this._reflectAriaState(attr));
      }
    
      _reflectAriaState(attr) {
        const isTrue = this.hasAttribute(attr);
        switch (attr) {
          case 'disabled':
            this.setAttribute('aria-disabled', isTrue ? 'true' : 'false');
            break;
          case 'open':
            this.setAttribute('aria-expanded', isTrue ? 'true' : 'false');
            break;
          case 'toggled':
            this.setAttribute('aria-pressed', isTrue ? 'true' : 'false');
            break;
          case 'pressed':
            this.setAttribute('aria-pressed', isTrue ? 'true' : 'false');
            break;
        }
      }
}