import styles from './style.css?inline'

export class StudyCard extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' })

        shadow.innerHTML = `
            <style>${styles}</style>
            <div data-study-card>
                <slot name="header">Year Header</slot>
                
                <div data-card-content>
                    <h4 class="title">Semester 1</h4>
                    <div data-card-module>
                        <slot name="content-1" data-card-module-slot></slot>
                    </div>

                    <h4 class="title">Semester 2</h4>
                    <div data-card-module>
                        <slot name="content-2" data-card-module-slot></slot>
                    </div>
                </div>
            </div>
        `
    }
}
