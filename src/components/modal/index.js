import './style.css'

export default class Modal {
    constructor() {
        this.modal = document.createElement('div')
        this.modal.className = 'modal-overlay'
        this.handleSubmit = this.handleSubmit.bind(this)
        this.modal.innerHTML = `
      <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">
        <button class="modal-close" aria-label="Close modal">&times;</button>
        <h2 id="modal-title"></h2>
        <form class="modal-form">
        </form>
      </div>
    `

        document.body.appendChild(this.modal)
        this.modalContent = this.modal.querySelector('.modal-content')
        this.titleElem = this.modal.querySelector('#modal-title')
        this.form = this.modal.querySelector('.modal-form')
        this.closeBtn = this.modal.querySelector('.modal-close')

        this.closeBtn.addEventListener('click', () => this.close())
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close()
        })

        this.handleEsc = this.handleEsc.bind(this)
    }

    open(module, isCustom) {
        this.titleElem.textContent = 'Module info'

        // Clear form
        this.form.innerHTML = ''

        // Nme
        this.form.appendChild(this.createField('Naam', 'name', module.name, isCustom))

        // Description
        this.form.appendChild(this.createField('Beschrijving', 'description', module.description || '', isCustom, true))

        // ECs
        this.form.appendChild(this.createField('ECs', 'ecs', module.ecs || 0, isCustom, false, 'number'))

        // Acquired EC
        this.form.appendChild(this.createField('Behaalde EC', 'acquiredEc', module.acquiredEc || 0, isCustom, false, 'number')
        );

        // If it's a custom module, add a submit button.
        if (isCustom) {
            const submitBtn = document.createElement('button')
            submitBtn.type = 'submit'
            submitBtn.textContent = 'Opslaan'
            submitBtn.className = 'modal-submit'
            this.form.appendChild(submitBtn)

            // Event listener for form submit
            this.form.addEventListener('submit', this.handleSubmit.bind(this))
        }

        this.modal.style.display = 'flex'
        this.modalContent.focus()

        document.addEventListener('keydown', this.handleEsc)
    }

    close() {
        this.modal.style.display = 'none'
        document.removeEventListener('keydown', this.handleEsc)
        this.form.removeEventListener('submit', this.handleSubmit)
    }

    handleEsc(e) {
        if (e.key === 'Escape') {
            this.close()
        }
    }

    createField(labelText, fieldName, value, isEditable, isTextarea = false, type = 'text') {
        const wrapper = document.createElement('div')
        wrapper.className = 'modal-field'

        const label = document.createElement('label')
        label.textContent = labelText
        label.setAttribute('for', `modal-${fieldName}`)

        let input
        if (isTextarea) {
            input = document.createElement('textarea')
            input.rows = 3
            input.value = value
            input.id = `modal-${fieldName}`
            input.name = fieldName
            input.readOnly = !isEditable
        } else {
            input = document.createElement('input')
            input.type = type
            input.value = value
            input.id = `modal-${fieldName}`
            input.name = fieldName
            input.readOnly = !isEditable
        }

        wrapper.appendChild(label)
        wrapper.appendChild(input)

        return wrapper
    }

    handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(this.form);
        const ecs = Number(formData.get('ecs'));
        const acquiredEc = Number(formData.get('acquiredEc'));

        if (acquiredEc < 0 || acquiredEc > 30) {
            alert('Behaalde EC moet tussen 0 en 30 zijn.');
            return;
        }

        const data = {
            // id is gained from API
            name: formData.get('name'),
            description: formData.get('description'),
            ecs: ecs,
            acquiredEc: acquiredEc,
            isCustom: true,
        };

        this.onSaveCallback?.(data);
        this.close();
    }


    setOnSaveCallback(callback) {
        this.onSaveCallback = callback
    }
}
