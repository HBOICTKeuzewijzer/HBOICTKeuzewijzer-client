import './style.css';

export default class Modal {
    constructor() {
        this.modal = document.createElement('div');
        this.modal.className = 'modal-overlay';

        // Bind once
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEsc = this.handleEsc.bind(this);

        this.modal.innerHTML = `
            <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">
                <button class="modal-close" aria-label="Close modal">&times;</button>
                <h2 id="modal-title"></h2>
                <form class="modal-form"></form>
            </div>
        `;

        document.body.appendChild(this.modal);
        this.modalContent = this.modal.querySelector('.modal-content');
        this.titleElem = this.modal.querySelector('#modal-title');
        this.form = this.modal.querySelector('.modal-form');
        this.closeBtn = this.modal.querySelector('.modal-close');

        this.closeBtn.addEventListener('click', () => this.close());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });

        // Attach submit listener once
        this.form.addEventListener('submit', this.handleSubmit);
    }

    open(module, isCustom, acquiredECs = 0) {
        this.titleElem.textContent = 'Module info';

        // Clear form
        this.form.innerHTML = '';

        // Name
        this.form.appendChild(this.createField('Naam', 'name', module.name, isCustom));

        // Description
        this.form.appendChild(this.createField('Beschrijving', 'description', module.description || '', isCustom, true));
        console.log(module)
        this.form.appendChild(this.createField('Niveau', 'level', module.level, false, false, 'number'));

        // ECs
        this.form.appendChild(this.createField('ECs', 'ec', module.ec || 0, isCustom, false, 'number'));

        // Acquired ECs — always editable
        this.form.appendChild(this.createField('Behaalde EC', 'acquiredECs', acquiredECs, true, false, 'number'));


        // Always show submit button
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.textContent = 'Opslaan';
        submitBtn.className = 'modal-submit';
        this.form.appendChild(submitBtn);

        this.modal.style.display = 'flex';
        this.modalContent.focus();
        document.addEventListener('keydown', this.handleEsc);
    }


    close() {
        this.modal.style.display = 'none';
        document.removeEventListener('keydown', this.handleEsc);
        // No need to remove submit listener since it's attached once in constructor
    }

    handleEsc(e) {
        if (e.key === 'Escape') {
            this.close();
        }
    }

    createField(labelText, fieldName, value, isEditable, isTextarea = false, type = 'text') {
        const wrapper = document.createElement('div');
        wrapper.className = 'modal-field';

        const label = document.createElement('label');
        label.textContent = labelText;
        label.setAttribute('for', `modal-${fieldName}`);

        let input;
        if (isTextarea) {
            input = document.createElement('textarea');
            input.rows = 3;
        } else {
            input = document.createElement('input');
            input.type = type;
        }
        input.value = value;
        input.id = `modal-${fieldName}`;
        input.name = fieldName;
        input.readOnly = !isEditable;

        wrapper.appendChild(label);
        wrapper.appendChild(input);

        return wrapper;
    }

    handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(this.form);
        const ec = Number(formData.get('ec'));
        const acquiredECs = Number(formData.get('acquiredECs'));

        if (acquiredECs < 0 || acquiredECs > 30) {
            alert('Behaalde EC moet tussen 0 en 30 zijn.');
            return;
        }

        const data = {
            name: formData.get('name'),
            description: formData.get('description'),
            ec: ec,
            acquiredECs: acquiredECs,
            isCustom: true,
        };

        this.onSaveCallback?.(data);
        this.close();
    }

    setOnSaveCallback(callback) {
        this.onSaveCallback = callback;
    }
}
