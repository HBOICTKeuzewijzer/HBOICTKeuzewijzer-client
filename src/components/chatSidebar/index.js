import styles from './style.css?inline';
import { fetcher } from '@/utils'
import { router } from '@/http/router';

export class ChatSidebar extends HTMLElement {
    constructor() {
        super();
        this.currentUser = null;
        const shadow = this.attachShadow({ mode: 'open' });

        shadow.innerHTML = `
        <style> ${styles}</style>        
          <div id="selected-chat">
            <button id="toggle-sidebar" class="open-btn" style="display: none;"></button>
          </div>
          <div id="chat-sidebar">
            <div class="sidebar-header">
              <div class="search-container">
                <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="gray" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  id="search-bar"
                  placeholder="Zoek op naam of studentnummer..."
                  aria-label="Zoek meldingen"
                />
              </div>
              <div class="title-wrapper">
                <h3>Meldingen</h3>
              </div>
            </div>
            <div id="chat-list" class="sidebar-content"></div>
          </div>
        `;

        this.isMobile = window.matchMedia('(max-width: 768px)').matches;
    }

    connectedCallback() {
        Promise.all([
            fetcher('auth/me', { method: 'GET' }),
            this.getChatData(),
        ])
            .then(([currentUser, chatData]) => {
                this.currentUser = currentUser;
                this.renderChatSidebar(chatData.items);
            })
            .catch((error) => {
                console.error("Fout bij ophalen van gegevens:", error);
            });

        const sidebar = this.shadowRoot.getElementById('chat-sidebar');
        const toggleButton = this.shadowRoot.getElementById('toggle-sidebar');

        toggleButton.style.display = 'block';

        let isSidebarOpen = true;
        toggleButton.textContent = '^';

        toggleButton.addEventListener('click', () => {
            isSidebarOpen = !isSidebarOpen;
            sidebar.style.display = isSidebarOpen ? 'flex' : 'none';
            toggleButton.textContent = isSidebarOpen ? '^' : 'v';
        });

        const searchBar = this.shadowRoot.getElementById('search-bar');
        searchBar.addEventListener('input', (event) => {
            const query = event.target.value.toLowerCase();
            this.filterChatList(query);
        });
    }
    getChatData() {
        return fetcher('chat', { method: 'GET' })
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error("Fout bij ophalen van chatgegevens via fetcher:", error);
                throw error;
            });
    }

    filterChatList(query) {
        const allChats = this.shadowRoot.querySelectorAll('.chat-item');

        allChats.forEach((chat) => {
            const chatName = chat.querySelector('.student-name').textContent.toLowerCase();
            const chatId = chat.querySelector('.student-id').textContent.toLowerCase();
            if (chatName.includes(query) || chatId.includes(query)) {
                chat.style.display = 'flex';
            } else {
                chat.style.display = 'none';
            }
        });
    }

    renderChatSidebar(chatData) {
        const chatListElement = this.shadowRoot.getElementById('chat-list');
        const selectedChatContainer = this.shadowRoot.getElementById('selected-chat');
        const toggleButton = this.shadowRoot.getElementById('toggle-sidebar');

        if (!toggleButton.dataset.listenerAdded) {
            toggleButton.addEventListener('click', () => {
                const sidebar = this.shadowRoot.getElementById('chat-sidebar');
                sidebar.classList.toggle('open');
            });
            toggleButton.dataset.listenerAdded = "true";
        }

        if (!this.currentUser) {
            console.error("De huidige gebruiker is niet geladen.");
            return;
        }

        chatData.forEach((chat) => {
            const isCurrentUserSLB = this.currentUser.id === chat.slbApplicationUserId;
            const person = isCurrentUserSLB ? chat.student : chat.slb;
            if (!person) {
                console.warn("Geen andere partij gevonden voor deze chat:", chat);
                return;
            }

            const displayName = person.displayName || 'Onbekende naam';
            const displayId = person.email || 'Onbekende ID';

            const chatItem = document.createElement('div');
            chatItem.classList.add('chat-item');

            chatItem.innerHTML = `
            <div class="profile-picture">
                <img src="" alt="${displayName}" />
            </div>
            <div class="chat-details">
                <span class="student-name">${displayName}</span>
                <span class="student-id">${displayId}</span>
            </div>
        `;

            chatItem.addEventListener('click', () => {
                const allItems = this.shadowRoot.querySelectorAll('.chat-item');
                allItems.forEach((item) => item.classList.remove('selected'));
                chatItem.classList.add('selected');

                selectedChatContainer.innerHTML = '';
                selectedChatContainer.appendChild(toggleButton);

                const selectedChat = document.createElement('div');
                selectedChat.classList.add('selected-chat-item');
                selectedChat.innerHTML = `
        <div class="profile-picture">
            <img src="" alt="${displayName}" />
        </div>
        <div class="chat-details">
            <span class="student-name">${displayName}</span>
            <span class="student-id">${displayId}</span>
        </div>
    `;

                selectedChatContainer.appendChild(selectedChat);
                toggleButton.style.display = 'block';
                const chatId = chat.id

                router.navigate(`/messages/${chatId}`);
                // hier kan je een functie aanroepen om de chat te laden anders kan je window.location.href = `/messages/${chatId}` proberen dit refreshed wel de pagina;
            });

            chatListElement.appendChild(chatItem);
        });
    }
}

