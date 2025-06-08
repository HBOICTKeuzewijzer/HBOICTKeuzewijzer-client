import CustomElement from '../customElement'
import chat from './chat.html?raw'
import styles from './chat.css?raw'
import { html } from '@/utils/functions'
import { fetcher } from '@utils/fetcher'

const template = html`
    <style>
        ${styles}
    </style>
    ${chat}
`

export class Chat extends CustomElement {
    constructor() {
        super()
        this.applyTemplate(template)
        this.chat = null
        this.currentUser = null
    }

    connectedCallback() {
        const sendBtn = this.shadowRoot.querySelector('#sendbutton')
        const input = this.shadowRoot.querySelector('.input-field')
        const toggleBtn = this.shadowRoot.querySelector('.toggle-sidebar')
        const container = this.shadowRoot.querySelector('.chat-container')

        sendBtn?.addEventListener('click', () => {
            const message = input?.value.trim()
            if (message) {
                this.sendMessage(message)
                input.value = ''
            }
        })

        input?.addEventListener('keydown', event => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                const message = input.value.trim()
                if (message) {
                    this.sendMessage(message)
                    input.value = ''
                }
            }
        })

        toggleBtn?.addEventListener('click', () => {
            container.classList.toggle('sidebar-open')
            if (!container.classList.contains('sidebar-open')) {
                input?.focus()
            }
        })

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                container.classList.remove('sidebar-open')
            }
        })

        this.loadChats()
    }

    async loadChats() {
        try {
            const container = this.shadowRoot.querySelector('.chat-messages')
            container.innerHTML = ''

            const urlParts = window.location.pathname.split('/')
            const chatId = urlParts.findLast(part => part.length === 36)

            this.currentUser = await fetcher('auth/me', { method: 'GET' })

            const allChats = await fetcher('chat', { method: 'GET' })

            const selectedChat = allChats.items.find(chat => chat.id === chatId)

            if (!selectedChat) {
                return
            }

            this.chat = selectedChat

            const sortedMessages = [...this.chat.messages].sort((a, b) => {
                const dateDiff = new Date(a.sentAt) - new Date(b.sentAt)
                return dateDiff !== 0 ? dateDiff : a.id.localeCompare(b.id)
            })

            sortedMessages.forEach(message => {
                const isFromMe = message.senderApplicationUserId === this.currentUser.id
                const senderId = message.senderApplicationUserId

                let senderName = 'Onbekend'
                if (isFromMe) {
                    senderName = 'Jij'
                } else if (senderId === this.chat.slbApplicationUserId) {
                    senderName = this.chat.slb?.displayName || 'SLB'
                } else if (senderId === this.chat.studentApplicationUserId) {
                    senderName = this.chat.student?.displayName || 'Student'
                }

                this.addMessage(senderName, message.messageText, isFromMe, message.sentAt)
            })

            this.scrollToBottom()
        } catch (error) {
            console.error('Error loading chats:', error)
        }
    }

    async sendMessage(messageText) {
        if (!this.chat || !this.currentUser) return

        const message = {
            messageText,
            chatId: this.chat.id,
            senderApplicationUserId: this.currentUser.id,
        }

        try {
            await fetcher(`chat/${this.chat.id}/message`, {
                method: 'POST',
                body: message,
            })

            await new Promise(res => setTimeout(res, 200))
            await this.loadChats()
        } catch (err) {
            console.error('Verzenden mislukt:', err)
        }
    }

    linkify(text) {
        const urlRegex = /((https?:\/\/|www\.)[^\s<]+)/g

        return text.replace(urlRegex, url => {
            const href = url.startsWith('http') ? url : `https://${url}`

            try {
                const urlObj = new URL(href)
                const shortText = '[Open link, studieroute]'

                return `<a href="${href}" target="_blank" rel="noopener noreferrer">${shortText}</a>`
            } catch (e) {
                return url
            }
        })
    }

    addMessage(sender, message, isFromMe = false, sentAt) {
        const container = this.shadowRoot.querySelector('.chat-messages')
        const msgEl = document.createElement('div')
        msgEl.className = isFromMe ? 'message4' : 'message2'

        const time = new Date(sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        msgEl.innerHTML = isFromMe
            ? `
        <div class="content2">
          <div class="titel">${sender}</div>
          <div class="message5">${this.linkify(message)}</div>
          <div class="time">${time}</div>
        </div>
      `
            : `
        <div class="content">
          <div class="titel1">${sender}</div>
          <div class="message5">${this.linkify(message)}</div>
          <div class="time">${time}</div>
        </div>
      `

        container.appendChild(msgEl)
        this.scrollToBottom()
    }

    scrollToBottom() {
        const container = this.shadowRoot.querySelector('.chat-messages')
        if (container) container.scrollTop = container.scrollHeight
    }
}
