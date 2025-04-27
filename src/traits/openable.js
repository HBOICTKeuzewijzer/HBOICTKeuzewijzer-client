/**
 * A mixin that adds "open" state management to a custom element.
 * The component must use the `open` attribute to reflect its open state,
 * and optionally respond to an animation for closing transitions.
 *
 * @template {typeof HTMLElement} T
 * @param {T} Base - The base class to extend.
 */
export const Openable = Base =>
    class extends Base {
        /**
         * Returns whether the element is currently open.
         * This checks for the presence of the `open` attribute.
         *
         * @returns {boolean} `true` if the element has the `open` attribute, otherwise `false`.
         */
        get open() {
            return this.hasAttribute('open')
        }

        /**
         * Sets the element's open state.
         * - Setting to `true` adds the `open` attribute and removes the `closing` attribute.
         * - Setting to `false` adds the `closing` attribute and removes `open` after the animation ends.
         *
         * Note: This assumes `this.contentElement` exists and triggers an `animationend` event.
         *
         * @param {boolean} state - The desired open state.
         */
        set open(state) {
            if (state) {
                this.setAttribute('open', '')
                this.removeAttribute('closing')
            } else {
                this.setAttribute('closing', '')
                this.contentElement?.addEventListener(
                    'animationend',
                    function handler() {
                        this.removeAttribute('open')
                        this.removeAttribute('closing')
                        this.contentElement?.removeEventListener('animationend', handler)
                    }.bind(this),
                    { once: true },
                )
            }
        }

        /**
         * Handles opening the element.
         * Intended for use as an event listener or internal logic.
         *
         * @private
         * @returns {void}
         */
        _openHandler = () => {
            this.open = true
        }

        /**
         * Handles closing the element.
         * Intended for use as an event listener or internal logic.
         *
         * @private
         * @returns {void}
         */
        _closeHandler = () => {
            this.open = false
        }

        /**
         * Toggles the current open state.
         * Intended for use as an event listener or internal logic.
         *
         * @private
         * @returns {void}
         */
        _toggleHandler = () => {
            this.open = !this.open
        }
    }
