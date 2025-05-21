// Import the router instance from the router module
// eslint-disable-next-line no-unused-vars
import { router } from '@http/router'

// Component definitions
import {
    Accordion,
    Dialog,
    Drawer,
    Popper,
    Popover,
    Sheet,
    StudyCard,
    Tooltip,
    InputMultiline,
    Input,
    PageHeader,
    Sidebar,
    Datatable,
    Chat,
    ChatSidebar,
    Header,
    HeaderLink
} from '@components'
customElements.define('x-accordion', Accordion)
customElements.define('x-dialog', Dialog)
customElements.define('x-drawer', Drawer)
customElements.define('x-popper', Popper)
customElements.define('x-popover', Popover)
customElements.define('x-input', Input)
customElements.define('x-multiline-input', InputMultiline)
customElements.define('x-sheet', Sheet)
customElements.define('x-study-card', StudyCard)
customElements.define('x-tooltip', Tooltip)
customElements.define('x-sidebar', Sidebar)
customElements.define('x-data-table', Datatable)
customElements.define('x-page-header', PageHeader)
customElements.define('x-chat', Chat)
customElements.define('chat-sidebar', ChatSidebar)
customElements.define('x-header', Header)
customElements.define('x-header-link', HeaderLink)
