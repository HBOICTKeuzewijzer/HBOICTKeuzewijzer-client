export const KeyboardNavigable = Base =>
    class extends Base {
        connectedCallback() {
            super.connectedCallback?.()
            this.addEventListener('keydown', this._keyDownHandler)
        }

        disconnectCallback() {
            this.removeEventListener('keydown', this._keyDownHandler)
        }

        _keyDownHandler = event => {
            switch (event.key) {
                case 'Escape':
                    this.dispatchEvent(new CustomEvent('keypress_escape'))
                    break
                default:
                    break
            }
        }
    }
