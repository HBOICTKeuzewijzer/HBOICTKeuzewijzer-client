import styles from './style.css?inline';

export class ChatSidebar extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        shadow.innerHTML = `
<style>${styles}</style>
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
                aria-label="Zoek meldingen" />
        </div>
        <div class="title-wrapper">
            <h3>Meldingen</h3>
        </div>
    </div>
    <div id="chat-list" class="sidebar-content"></div>
</div>
<button id="toggle-sidebar" class="open-btn" aria-label="Toggle sidebar"></button>
`;


        this.isMobile = window.matchMedia('(max-width: 768px)').matches;
    }

    connectedCallback() {
        const chatData = this.getChatData();
        this.renderChatSidebar(chatData);

        const toggleButton = this.shadowRoot.getElementById('toggle-sidebar');
        const sidebar = this.shadowRoot.getElementById('chat-sidebar');

        toggleButton.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        const searchBar = this.shadowRoot.getElementById('search-bar');
        searchBar.addEventListener('input', (event) => {
            const query = event.target.value.toLowerCase();
            this.filterChatList(query);
        });
    }
    //todo zoekbalk uit deze component halen.
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


    getChatData() {
        // voor nu statisch. Hier komt een API-aanroep doen om de chatgegevens op te halen
        return [
            {
                "id": "e05e67ed-ee2d-4725-bf19-202fd231f248",
                "slb": {
                    "id": "e83717e4-5c88-4495-8ad6-bcf0950ea2a5",
                    "externalId": "0c7e1df5-c8b5-4ea5-b365-1733d66915cd",
                    "email": "p.potter@gmail.com",
                    "displayName": "Pietje potter",
                    "code": "1194545"
                },
                "student": {
                    "id": "db08ae21-b07d-4daf-a660-5fdcd468a3b9",
                    "externalId": "064f3ec8-4462-421e-9190-2461c5e150a3",
                    "email": "wulwuw@kekazam.kh",
                    "displayName": "Milton Owens",
                    "code": "606579"
                }
            },
            {
                "id": "eca71b55-a435-4ae5-81ff-2ad1bcef44fa",
                "slb": {
                    "id": "91ee87e1-32c6-4237-868c-4d2dc9acdb23",
                    "externalId": "f17b4f1c-37aa-46e0-90fe-0fede8dabccf",
                    "email": "nowif@dircesedi.ir",
                    "displayName": "Garrett Bass",
                    "code": "348187"
                },
                "student": {
                    "id": "ec27149f-dcfc-4466-9002-4112ee6bd5bb",
                    "externalId": "58c515d3-4ee4-43ca-ba23-d15d424e0b7c",
                    "email": "junamih@jo.gt",
                    "displayName": "Louis Page",
                    "code": "824890"
                }
            },
            {
                "id": "d276a061-8d19-4406-af09-15c583544d71",
                "slb": {
                    "id": "ba9d250c-c2c6-41d7-918d-fed3b63c85a9",
                    "externalId": "65957903-d2eb-407d-b6be-ed723cb5b1b0",
                    "email": "isve@olegba.va",
                    "displayName": "Keith McCormick",
                    "code": "744224"
                },
                "student": {
                    "id": "656fe4cf-ef7a-4ba5-97a9-792182889f0c",
                    "externalId": "421dc4ad-4433-462b-8234-7929e9266fb6",
                    "email": "putumam@jahorcif.kg",
                    "displayName": "Eva Rogers",
                    "code": "658432"
                }
            },
            {
                "id": "98e57f0e-f5f8-493d-9c56-93ce2c425f5a",
                "slb": {
                    "id": "1b0bf7d9-592a-4d91-b7e2-7cb1477ce8ce",
                    "externalId": "9afad23f-3fb2-48a5-a5cd-3e93c66bc453",
                    "email": "oklik@pilko.ps",
                    "displayName": "Lora Padilla",
                    "code": "154062"
                },
                "student": {
                    "id": "3c2429f6-ef81-4eee-afc2-b45bfa860087",
                    "externalId": "89b10461-0b26-4676-8e0d-6e5c6e44153c",
                    "email": "jukicij@mes.gu",
                    "displayName": "Catherine Allison",
                    "code": "946669"
                }
            },
            {
                "id": "32a65d0c-eff8-4c8f-add4-60c6f78fdaf2",
                "slb": {
                    "id": "cf7249f8-223d-402b-a78c-e0860bac90ec",
                    "externalId": "06513a18-5ddb-4383-b822-5addb7732d25",
                    "email": "vi@mezuhan.et",
                    "displayName": "Chester Franklin",
                    "code": "317675"
                },
                "student": {
                    "id": "85e4edd3-6e91-406b-bd0f-1fbd5295ceb0",
                    "externalId": "8168181e-7190-445a-b107-88bc8281bcae",
                    "email": "hucocuv@paderce.de",
                    "displayName": "Roger Blake",
                    "code": "257403"
                }
            },
            {
                "id": "e05e67ed-ee2d-4725-bf19-202fd231f248",
                "slb": {
                    "id": "e83717e4-5c88-4495-8ad6-bcf0950ea2a5",
                    "externalId": "0c7e1df5-c8b5-4ea5-b365-1733d66915cd",
                    "email": "p.potter@gmail.com",
                    "displayName": "Pietje potter",
                    "code": "1194545"
                },
                "student": {
                    "id": "db08ae21-b07d-4daf-a660-5fdcd468a3b9",
                    "externalId": "064f3ec8-4462-421e-9190-2461c5e150a3",
                    "email": "wulwuw@kekazam.kh",
                    "displayName": "Milton Owens",
                    "code": "606579"
                }
            },
            {
                "id": "eca71b55-a435-4ae5-81ff-2ad1bcef44fa",
                "slb": {
                    "id": "91ee87e1-32c6-4237-868c-4d2dc9acdb23",
                    "externalId": "f17b4f1c-37aa-46e0-90fe-0fede8dabccf",
                    "email": "nowif@dircesedi.ir",
                    "displayName": "Garrett Bass",
                    "code": "348187"
                },
                "student": {
                    "id": "ec27149f-dcfc-4466-9002-4112ee6bd5bb",
                    "externalId": "58c515d3-4ee4-43ca-ba23-d15d424e0b7c",
                    "email": "junamih@jo.gt",
                    "displayName": "Louis Page",
                    "code": "824890"
                }
            },
            {
                "id": "d276a061-8d19-4406-af09-15c583544d71",
                "slb": {
                    "id": "ba9d250c-c2c6-41d7-918d-fed3b63c85a9",
                    "externalId": "65957903-d2eb-407d-b6be-ed723cb5b1b0",
                    "email": "isve@olegba.va",
                    "displayName": "Keith McCormick",
                    "code": "744224"
                },
                "student": {
                    "id": "656fe4cf-ef7a-4ba5-97a9-792182889f0c",
                    "externalId": "421dc4ad-4433-462b-8234-7929e9266fb6",
                    "email": "putumam@jahorcif.kg",
                    "displayName": "Eva Rogers",
                    "code": "658432"
                }
            },
            {
                "id": "98e57f0e-f5f8-493d-9c56-93ce2c425f5a",
                "slb": {
                    "id": "1b0bf7d9-592a-4d91-b7e2-7cb1477ce8ce",
                    "externalId": "9afad23f-3fb2-48a5-a5cd-3e93c66bc453",
                    "email": "oklik@pilko.ps",
                    "displayName": "Lora Padilla",
                    "code": "154062"
                },
                "student": {
                    "id": "3c2429f6-ef81-4eee-afc2-b45bfa860087",
                    "externalId": "89b10461-0b26-4676-8e0d-6e5c6e44153c",
                    "email": "jukicij@mes.gu",
                    "displayName": "Catherine Allison",
                    "code": "946669"
                }
            },
            {
                "id": "e05e67ed-ee2d-4725-bf19-202fd231f248",
                "slb": {
                    "id": "e83717e4-5c88-4495-8ad6-bcf0950ea2a5",
                    "externalId": "0c7e1df5-c8b5-4ea5-b365-1733d66915cd",
                    "email": "p.potter@gmail.com",
                    "displayName": "Pietje potter",
                    "code": "1194545"
                },
                "student": {
                    "id": "db08ae21-b07d-4daf-a660-5fdcd468a3b9",
                    "externalId": "064f3ec8-4462-421e-9190-2461c5e150a3",
                    "email": "wulwuw@kekazam.kh",
                    "displayName": "Milton Owens",
                    "code": "606579"
                }
            },
            {
                "id": "eca71b55-a435-4ae5-81ff-2ad1bcef44fa",
                "slb": {
                    "id": "91ee87e1-32c6-4237-868c-4d2dc9acdb23",
                    "externalId": "f17b4f1c-37aa-46e0-90fe-0fede8dabccf",
                    "email": "nowif@dircesedi.ir",
                    "displayName": "Garrett Bass",
                    "code": "348187"
                },
                "student": {
                    "id": "ec27149f-dcfc-4466-9002-4112ee6bd5bb",
                    "externalId": "58c515d3-4ee4-43ca-ba23-d15d424e0b7c",
                    "email": "junamih@jo.gt",
                    "displayName": "Louis Page",
                    "code": "824890"
                }
            },
            {
                "id": "d276a061-8d19-4406-af09-15c583544d71",
                "slb": {
                    "id": "ba9d250c-c2c6-41d7-918d-fed3b63c85a9",
                    "externalId": "65957903-d2eb-407d-b6be-ed723cb5b1b0",
                    "email": "isve@olegba.va",
                    "displayName": "Keith McCormick",
                    "code": "744224"
                },
                "student": {
                    "id": "656fe4cf-ef7a-4ba5-97a9-792182889f0c",
                    "externalId": "421dc4ad-4433-462b-8234-7929e9266fb6",
                    "email": "putumam@jahorcif.kg",
                    "displayName": "Eva Rogers",
                    "code": "658432"
                }
            },
            {
                "id": "98e57f0e-f5f8-493d-9c56-93ce2c425f5a",
                "slb": {
                    "id": "1b0bf7d9-592a-4d91-b7e2-7cb1477ce8ce",
                    "externalId": "9afad23f-3fb2-48a5-a5cd-3e93c66bc453",
                    "email": "oklik@pilko.ps",
                    "displayName": "Lora Padilla",
                    "code": "154062"
                },
                "student": {
                    "id": "3c2429f6-ef81-4eee-afc2-b45bfa860087",
                    "externalId": "89b10461-0b26-4676-8e0d-6e5c6e44153c",
                    "email": "jukicij@mes.gu",
                    "displayName": "Catherine Allison",
                    "code": "946669"
                }
            },
            {
                "id": "e05e67ed-ee2d-4725-bf19-202fd231f248",
                "slb": {
                    "id": "e83717e4-5c88-4495-8ad6-bcf0950ea2a5",
                    "externalId": "0c7e1df5-c8b5-4ea5-b365-1733d66915cd",
                    "email": "p.potter@gmail.com",
                    "displayName": "Pietje potter",
                    "code": "1194545"
                },
                "student": {
                    "id": "db08ae21-b07d-4daf-a660-5fdcd468a3b9",
                    "externalId": "064f3ec8-4462-421e-9190-2461c5e150a3",
                    "email": "wulwuw@kekazam.kh",
                    "displayName": "Milton Owens",
                    "code": "606579"
                }
            },
            {
                "id": "eca71b55-a435-4ae5-81ff-2ad1bcef44fa",
                "slb": {
                    "id": "91ee87e1-32c6-4237-868c-4d2dc9acdb23",
                    "externalId": "f17b4f1c-37aa-46e0-90fe-0fede8dabccf",
                    "email": "nowif@dircesedi.ir",
                    "displayName": "Garrett Bass",
                    "code": "348187"
                },
                "student": {
                    "id": "ec27149f-dcfc-4466-9002-4112ee6bd5bb",
                    "externalId": "58c515d3-4ee4-43ca-ba23-d15d424e0b7c",
                    "email": "junamih@jo.gt",
                    "displayName": "Louis Page",
                    "code": "824890"
                }
            },
            {
                "id": "d276a061-8d19-4406-af09-15c583544d71",
                "slb": {
                    "id": "ba9d250c-c2c6-41d7-918d-fed3b63c85a9",
                    "externalId": "65957903-d2eb-407d-b6be-ed723cb5b1b0",
                    "email": "isve@olegba.va",
                    "displayName": "Keith McCormick",
                    "code": "744224"
                },
                "student": {
                    "id": "656fe4cf-ef7a-4ba5-97a9-792182889f0c",
                    "externalId": "421dc4ad-4433-462b-8234-7929e9266fb6",
                    "email": "putumam@jahorcif.kg",
                    "displayName": "Eva Rogers",
                    "code": "658432"
                }
            },
            {
                "id": "98e57f0e-f5f8-493d-9c56-93ce2c425f5a",
                "slb": {
                    "id": "1b0bf7d9-592a-4d91-b7e2-7cb1477ce8ce",
                    "externalId": "9afad23f-3fb2-48a5-a5cd-3e93c66bc453",
                    "email": "oklik@pilko.ps",
                    "displayName": "Lora Padilla",
                    "code": "154062"
                },
                "student": {
                    "id": "3c2429f6-ef81-4eee-afc2-b45bfa860087",
                    "externalId": "89b10461-0b26-4676-8e0d-6e5c6e44153c",
                    "email": "jukicij@mes.gu",
                    "displayName": "Catherine Allison",
                    "code": "946669"
                }
            }
        ];
    }

    renderChatSidebar(chatData) {
        const chatListElement = this.shadowRoot.getElementById('chat-list');

        chatData.forEach((chat) => {
            const chatItem = document.createElement('div');
            chatItem.classList.add('chat-item');

            chatItem.innerHTML = `
            <div class="profile-picture">
                <img src="" alt="${chat.student.displayName}" />
            </div>
            <div class="chat-details">
                <span class="student-name">${chat.student.displayName}</span>
                <span class="student-id">s${chat.student.code}</span>
            </div>
        `;
            chatItem.addEventListener('click', () => {
                const allItems = this.shadowRoot.querySelectorAll('.chat-item');
                allItems.forEach((item) => item.classList.remove('selected'));

                chatItem.classList.add('selected');
                console.log(`Chat geselecteerd: ${chat.student.displayName}`);
            });

            chatListElement.appendChild(chatItem);
        });
    }
}

customElements.define('chat-sidebar', ChatSidebar);
