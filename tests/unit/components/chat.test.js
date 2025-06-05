import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Chat } from '@/components/chat'
import { fetcher } from '@/utils/fetcher'

vi.mock('@/utils/fetcher', () => ({
    fetcher: vi.fn(),
}))

if (!customElements.get('chat-component')) {
    customElements.define('chat-component', Chat)
}

it('should render essential elements', () => {
    const el = new Chat()
    document.body.appendChild(el)
    const shadow = el.shadowRoot

    expect(shadow.querySelector('#sendbutton')).toBeTruthy()
    expect(shadow.querySelector('.input-field')).toBeTruthy()
    expect(shadow.querySelector('.toggle-sidebar')).toBeTruthy()
    expect(shadow.querySelector('.chat-container')).toBeTruthy()
})

it('should call sendMessage when clicking sendbutton with valid input', async () => {
  const el = new Chat()
  document.body.appendChild(el)

  // 👇 Wacht één tick zodat connectedCallback is uitgevoerd
  await Promise.resolve()

  const shadow = el.shadowRoot
  const input = shadow.querySelector('.input-field')
  const sendBtn = shadow.querySelector('#sendbutton')

  expect(sendBtn).toBeTruthy()
  expect(input).toBeTruthy()

  input.value = 'Hallo'

  el.sendMessage = vi.fn()

  // 👇 Simuleer click
  sendBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }))

  expect(el.sendMessage).toHaveBeenCalledWith('Hallo')
})


it('should call sendMessage when pressing Enter with valid input', () => {
    const el = new Chat()
    document.body.appendChild(el)
    const shadow = el.shadowRoot

    const input = shadow.querySelector('.input-field')
    input.value = 'Testbericht'

    el.sendMessage = vi.fn()

    const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        shiftKey: false,
        bubbles: true,
        cancelable: true,
    })

    input.dispatchEvent(event)

    expect(el.sendMessage).toHaveBeenCalledWith('Testbericht')
})

it('should toggle sidebar-open class and focus input when closing sidebar', () => {
    const el = new Chat()
    document.body.appendChild(el)
    const shadow = el.shadowRoot

    const container = shadow.querySelector('.chat-container')
    const toggleBtn = shadow.querySelector('.toggle-sidebar')
    const input = shadow.querySelector('.input-field')

    const focusSpy = vi.spyOn(input, 'focus')

    // initieel: geen class
    expect(container.classList.contains('sidebar-open')).toBe(false)

    // toggle AAN
    toggleBtn.click()
    expect(container.classList.contains('sidebar-open')).toBe(true)

    // toggle UIT
    toggleBtn.click()
    expect(container.classList.contains('sidebar-open')).toBe(false)

    // input krijgt focus
    expect(focusSpy).toHaveBeenCalled()
})

it('should call addMessage with correct sender and message', async () => {
    const el = new Chat()
    document.body.appendChild(el)
    const shadow = el.shadowRoot

    const fakeChatId = '12345678-1234-1234-1234-123456789abc'

    // Zet fake URL
    window.history.pushState({}, '', `/chat/${fakeChatId}`)

    const mockUser = { id: 'u1' }
    const mockChat = {
        id: fakeChatId,
        messages: [
            {
                id: 'm1',
                messageText: 'Hoi!',
                sentAt: new Date().toISOString(),
                senderApplicationUserId: 'u1',
            },
        ],
        slbApplicationUserId: 'slb1',
        studentApplicationUserId: 'u2',
        slb: { displayName: 'Mevrouw SLB' },
        student: { displayName: 'Studentje' },
    }

    fetcher.mockImplementation(async url => {
        if (url === 'auth/me') return mockUser
        if (url === 'chat') return { items: [mockChat] }
        return null
    })

    // Mock addMessage
    el.addMessage = vi.fn()
    await el.loadChats()

    expect(el.chat).toEqual(mockChat)
    expect(el.addMessage).toHaveBeenCalledWith(
        'Jij', // sender name
        'Hoi!',
        true,
        expect.any(String),
    )
})
