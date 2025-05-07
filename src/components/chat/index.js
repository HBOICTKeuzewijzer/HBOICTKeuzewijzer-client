import CustomElement from "../customElement"
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

        sendBtn?.addEventListener('click', () => {
            const message = input?.value.trim()
            if (message) {
                this.sendMessage(message)
                input.value = ''
            }
        })

        this.loadChats()
    }

    async loadChats() {
        try {
            const container = this.shadowRoot.querySelector('.chat-messages')
            container.innerHTML = ''

            this.currentUser = await fetcher('auth/me', { method: 'GET' })
            const chats = await fetcher('chat', { method: 'GET' })
            this.chat = chats.items?.[0] ?? null

            if (!this.chat || !Array.isArray(this.chat.messages)) return

            // ✅ Sorteer op sentAt
            const sortedMessages = [...this.chat.messages].sort((a, b) => {
                const dateA = Date.parse(a.sentAt)
                const dateB = Date.parse(b.sentAt)
                return dateA - dateB // oudste eerst
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

                this.addMessage(senderName, message.messageText, isFromMe)
            })

            this.scrollToBottom()
        } catch (error) {
            console.error('Error loading chats:', error)
        }
    }

    async sendMessage(messageText) {
        if (!this.chat || !this.currentUser) return;
      
        const message = {
          messageText,
          sentAt: new Date().toISOString(),
          chatId: this.chat.id,
          senderApplicationUserId: this.currentUser.id
        };
      
        try {
          await fetcher(`chat/${this.chat.id}/message`, {
            method: 'POST',
            body: message
          });
      
          // ⏳ tijdelijke vertraging om database commit af te wachten
          await new Promise(res => setTimeout(res, 200))
      
          await this.loadChats();
        } catch (err) {
          console.error('Verzenden mislukt:', err);
        }
      }
      


    addMessage(sender, message, isFromMe = false) {
        const container = this.shadowRoot.querySelector('.chat-messages')
        const msgEl = document.createElement('div')
        msgEl.className = isFromMe ? 'message4' : 'message2'

        msgEl.innerHTML = isFromMe
            ? `
        <div class="content2">
          <div class="titel">${sender}</div>
          <div class="message5">${message}</div>
        </div>
      `
            : `
        <div class="content">
          <div class="titel1">${sender}</div>
          <div class="message3">${message}</div>
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
