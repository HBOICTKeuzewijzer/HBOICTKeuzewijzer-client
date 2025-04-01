import { Modal } from '@components'

export default function HomePage(params) {
    return `
        <div class="container">
            <x-modal>We maken gebruik van een custom webcomponent. Params: ${Object.entries(params)}</x-modal>
        </div>
    `
}
