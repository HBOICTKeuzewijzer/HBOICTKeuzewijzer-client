import { Modal } from '@components'

export default function HomePage(params) {
    return `
        <x-modal>We maken gebruik van een custom webcomponent. Params: ${Object.entries(params)}</x-modal>
    `
}
