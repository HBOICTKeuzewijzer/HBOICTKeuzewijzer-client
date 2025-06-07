import styles from './style.css?inline'
import { fetcher } from '@/utils'
import { router } from '@/http/router'

export class ChatSidebar extends HTMLElement {
    constructor() {
        super()
        this.currentUser = null
        const shadow = this.attachShadow({ mode: 'open' })

        shadow.innerHTML = `
        <style> ${styles}</style>        
          <div id="selected-chat">
            
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
              
                <h3>Meldingen
                          <button id="new-chat-btn" class="new-chat-btn">Nieuwe Chat</button>
               </h3>
              </div>
            </div>
            <div id="chat-list" class="sidebar-content"></div>
           <x-dialog id="newChatDialog" closable>
            <div>
                <h2>Voer het e-mailadres in om een chat te starten.</h2>
                <br>
                <x-input id="newChatEmail" placeholder="E-mailadres" submitenter></x-input>
                <br>
                <button id="newChatConfirmYes">Toevoegen</button>
                <button id="newChatConfirmNo">Annuleren</button>
            </div>
        </x-dialog>


          </div>
        `

        this.isMobile = window.matchMedia('(max-width: 768px)').matches;
    }



    markChatAsRead(chatId) {
        fetcher(`chat/mark-as-read/${chatId}`, { method: 'PUT' })
            .then(() => {
                this.removeUnreadIndicator(chatId); 
            })
            .catch((error) => {
                console.error(`Fout bij het markeren van de chat als gelezen:`, error);
            });
    }


    createNewChat(newChatInput, newChatDialog) {
        const email = newChatInput.value.trim();

        newChatInput.error = '';

        if (!this.validateEmail(email)) {
            newChatInput.error = 'Voer een geldig e-mailadres in.';
            return;
        }

         fetcher('chat/create', {
        method: 'POST',
        body: { email }  // geef gewoon een object mee, fetcher stringify het automatisch
    })
            .then(() => {
                this.getChatData().then(chatData => {
                    this.renderChatSidebar(chatData.items, []);
                });
                newChatDialog.removeAttribute('open');
            })
            .catch(err => {
                console.error('Fout bij het starten van de nieuwe chat:', err);

                if (err.message && err.message.includes("User with email")) {
                    newChatInput.error = 'E-mailadres bestaat niet binnen Windesheim. Controleer en probeer opnieuw.';
                } else if (err.message === 'Network Error') {
                    newChatInput.error = 'Netwerkfout, controleer uw verbinding.';
                } else {
                    newChatInput.error = 'Er ging iets mis bij het starten van een nieuwe chat. Probeer het opnieuw.';
                }
            });
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    connectedCallback() {
        Promise.all([
            fetcher('auth/me', { method: 'GET' }),
            this.getChatData(),
            this.getHasUnreadMessages()
        ])
            .then(([currentUser, chatData, unreadStatuses]) => {
                this.currentUser = currentUser;

                this.renderChatSidebar(chatData.items, unreadStatuses);

                const currentUrl = window.location.pathname;
                const chatIdFromUrl = currentUrl.split('/').pop();
                const matchingChat = chatData.items.find(chat => chat.id === chatIdFromUrl);

                if (matchingChat) {
                    this.markChatAsRead(matchingChat.id);
                }
            })
            .catch(error => {
                console.error("Fout bij ophalen van gegevens:", error);
            });

        const newChatBtn = this.shadowRoot.getElementById('new-chat-btn');
        const newChatDialog = this.shadowRoot.getElementById('newChatDialog');
        const newChatConfirmYesBtn = this.shadowRoot.getElementById('newChatConfirmYes');
        const newChatConfirmNoBtn = this.shadowRoot.getElementById('newChatConfirmNo');
        const newChatInput = this.shadowRoot.getElementById('newChatEmail');

        newChatBtn.addEventListener('click', () => {
            newChatDialog.setAttribute('open', '');
            newChatInput.value = ''; 
            newChatInput.error = ''; 
        });

        newChatConfirmYesBtn.addEventListener('click', () => this.createNewChat(newChatInput, newChatDialog));

        newChatConfirmNoBtn.addEventListener('click', () => {
            newChatDialog.removeAttribute('open');
        });

        newChatInput.addEventListener('onSubmitEnter', () => this.createNewChat(newChatInput, newChatDialog));

        const searchBar = this.shadowRoot.getElementById('search-bar');
        searchBar.addEventListener('input', (event) => {
            const query = event.target.value.toLowerCase().trim();
            this.filterChatList(query);
        });

    }
    getChatData() {
        return fetcher('chat', { method: 'GET' })
            .then(data => {
                return data
            })
            .catch(error => {
                console.error('Fout bij ophalen van chatgegevens via fetcher:', error)
                throw error
            })
    }

    filterChatList(query) {
        const allChats = this.shadowRoot.querySelectorAll('.chat-item')

        allChats.forEach(chat => {
            const chatName = chat.querySelector('.student-name').textContent.toLowerCase()
            const chatId = chat.querySelector('.student-id').textContent.toLowerCase()
            if (chatName.includes(query) || chatId.includes(query)) {
                chat.style.display = 'flex'
            } else {
                chat.style.display = 'none'
            }
        })
    }
    getHasUnreadMessages() {
        return fetcher('chat/has-unread', { method: 'GET' })
            .then((response) => {
                return response; 
            })
            .catch((error) => {
                console.error("Fout bij ophalen van ongelezen berichten:", error);
                throw error;
            });
    }
    renderChatSidebar(chatData, unreadStatuses) {
        const chatListElement = this.shadowRoot.getElementById('chat-list');
        const selectedChatContainer = this.shadowRoot.getElementById('selected-chat');

        
        chatListElement.innerHTML = '';

        if (!this.currentUser) {
            console.error('De huidige gebruiker is niet geladen.')
            return
        }


        function getInitials(name) {
            if (!name) return '';

            const cleanedName = name.replace(/\([^)]*\)/g, '').trim();

            const parts = cleanedName.split(/\s+/);

            if (parts.length === 1) {
                const first = parts[0][0].toUpperCase();
                return first + first;
            }

            const first = parts[0][0].toUpperCase();
            const last = parts[parts.length - 1][0].toUpperCase();

            return first + last;
        }

        chatData.forEach((chat) => {
            const isCurrentUserSLB = this.currentUser.id === chat.slbApplicationUserId;
            const person = isCurrentUserSLB ? chat.student : chat.slb;
            if (!person) {
                console.warn('Geen andere partij gevonden voor deze chat:', chat)
                return
            }

            const displayName = person.displayName || 'Onbekende naam';
            const displayId = person.email || 'Onbekende ID';

            const unreadStatus = unreadStatuses.find((status) => status.chatId === chat.id);
            const hasUnreadMessages = unreadStatus ? unreadStatus.hasUnread : false;

            const chatItem = document.createElement('div');
            chatItem.classList.add('chat-item');

            chatItem.dataset.chatId = chat.id;

            chatItem.innerHTML = `
            <div class="profile-picture" style="display: flex; justify-content: center; align-items: center; background-color: #f0f0f0; color: #555; font-weight: bold; font-size: 1rem; border-radius: 50%; width: 40px; height: 40px;">
                ${person.photoURL ? `<img src="${person.photoURL}" alt="${displayName}" />` : getInitials(displayName)}
            </div>
            <div class="chat-details">
                <span class="student-name">${displayName}</span>
                <span class="student-id">${displayId}</span>
            </div>
            ${hasUnreadMessages ? `<span class="unread-indicator"></span>` : ''}
        `;

            chatItem.addEventListener('click', () => {
                const allItems = this.shadowRoot.querySelectorAll('.chat-item')
                allItems.forEach(item => item.classList.remove('selected'))
                chatItem.classList.add('selected')

                selectedChatContainer.innerHTML = ''

                const selectedChat = document.createElement('div')
                selectedChat.classList.add('selected-chat-item')
                selectedChat.innerHTML = `
                <div class="profile-picture" style="display: flex; justify-content: center; align-items: center; background-color: #f0f0f0; color: #555; font-weight: bold; font-size: 1rem; border-radius: 50%; width: 40px; height: 40px;">
                    ${person.photoURL ? `<img src="${person.photoURL}" alt="${displayName}" />` : getInitials(displayName)}
                </div>
                <div class="chat-details">
                    <span class="student-name">${displayName}</span>
                    <span class="student-id">${displayId}</span>
                </div>
            `;

                selectedChatContainer.appendChild(selectedChat);
                const chatId = chat.id;

                fetcher(`chat/mark-as-read/${chatId}`, { method: 'PUT' })
                    .then(() => {

                        this.removeUnreadIndicator(chatId);
                    });

                router.navigate(`/messages/${chatId}`);
            });

            chatListElement.appendChild(chatItem);
        });
    }
    removeUnreadIndicator(chatId) {
        const chatItem = Array.from(this.shadowRoot.querySelectorAll('.chat-item'))
            .find(item => item.dataset.chatId === chatId);

        if (chatItem) {
            const unreadIndicator = chatItem.querySelector('.unread-indicator');
            if (unreadIndicator) {
                unreadIndicator.remove();
            } else {
            }
        } else {
        }
    }
}

