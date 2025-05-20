import { Auth, fetcher } from '@utils';

export default function Layout(children) {
    const imageURL = new URL('@assets/images/windesheim-logo.png', import.meta.url).href;
    const user = Auth.getUser();
    let hasUnreadMessages = false;

    function injectStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
        .toaster {
            position: fixed;
            top: 80px; /* Onder de header */
            right: 20px;
            background: rgba(0, 0, 0, 0.7); /* Transparante achtergrond */
            color: white;
            padding: 20px 40px; /* Grotere proporties */
            border-radius: 12px;
            font-size: 16px; /* Grotere tekst */
            z-index: 1000;
            opacity: 0;
            transform: translateY(-20%);
            transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); /* Schaduw voor diepte */
        }
        
        .toaster.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .toaster.hidden {
            opacity: 0;
            transform: translateY(-20%);
        }
    `;
        document.head.appendChild(style);
    }
    function showToaster() {
        const toaster = document.getElementById('toaster');
        if (toaster) {
            toaster.classList.remove('hidden');
            toaster.classList.add('visible');

            setTimeout(() => {
                toaster.classList.remove('visible');
                toaster.classList.add('hidden');
            }, 5000);
        }
    }

    function getInitials(name) {
        if (!name) return '';

        const parts = name.trim().split(/\s+/);

        if (parts.length === 1) {
            return parts[0][0].toUpperCase();
        }

        const first = parts[0][0].toUpperCase();
        const last = parts[parts.length - 1][0].toUpperCase();

        return first + last;
    }

    function pollUnreadMessages() {
        return fetcher('chat/has-unread', { method: 'GET' })
            .then((response) => {
                console.log('Chats met ongelezen berichten:', response);

                const hadUnreadMessages = hasUnreadMessages;

                if (Array.isArray(response) && response.some(chat => chat.hasUnread)) {
                    hasUnreadMessages = true;

                    if (!hadUnreadMessages) {
                        showToaster();
                    }
                } else {
                    hasUnreadMessages = false;
                }

                toggleUnreadIndicator(hasUnreadMessages);

                return response;
            })
            .catch((error) => {
                console.error('Fout bij ophalen van ongelezen berichten:', error);
                throw error;
            });
    }

    function toggleUnreadIndicator(hasUnread) {
        const unreadContainer = document.querySelector('a[href="/messages"] span[style="position:relative;"]');
        const unreadIndicator = unreadContainer?.querySelector('.relative.flex.size-3');

        console.log('Has unread:', hasUnread);
        console.log('Unread container element:', unreadContainer);

        if (hasUnread) {
            if (!unreadIndicator) {
                const indicatorHTML = `
                <span class="relative flex size-3" style="position: absolute; display: flex; width: 8px; height: 8px; right: 0; top: 0;">
                    <span class="animate-ping"
                        style="position: absolute; display:inline-flex; height: 100%; width: 100%; opacity: 75%; background-color: rgb(var(--color-light-pink)); border-radius: var(--rounded-full);">
                    </span>
                    <span
                        style="position: relative; display:inline-flex; height: 8px; width: 8px; background-color: rgb(var(--color-red)); border-radius: var(--rounded-full);">
                    </span>
                </span>`;
                unreadContainer?.insertAdjacentHTML('beforeend', indicatorHTML);
            }
        } else {
            if (unreadIndicator) {
                unreadIndicator.remove();
            }
        }
    }

    injectStyles();

    setTimeout(() => {
        pollUnreadMessages();
        setInterval(pollUnreadMessages, 30000);
    }, 0);

    return /*html*/ `
    <div>
        <header>
            <a href="/">
                <img src="${imageURL}" />
            </a>
            <div class="headerActions">
                ${
        Auth.isLoggedIn
            ? /*html*/ `
                            <x-tooltip position="left" placement="middle">
                                <a slot="trigger" href="/messages" data-icon>
                                    <span style="position:relative;">
                                        <i class="ph ph-chat"></i>
                                    </span>
                                </a>
                                <p class="color-black text-sm">Berichten</p>
                            </x-tooltip>

                            <x-popover position="bottom" placement="right">
                                <button slot="trigger" id="profile">${getInitials(user?.name)}</button>
                                
                                <button popover-action type="button" href="/saved-routes" class="text-sm">
                                    <i class="ph-duotone ph-bookmarks-simple"></i>
                                    Opgeslagen Routes
                                </button>
                                <button popover-action danger type="button" href="${import.meta.env.VITE_API_URL}/auth/logout?returnURL=${import.meta.env.VITE_APP_URL}" class="text-sm">
                                    <i class="ph-duotone ph-sign-out"></i>
                                    Uitloggen
                                </button>
                            </x-popover>
                        `
            : /*html*/ `
                            <x-tooltip position="left" placement="middle" class="hidden md:block">
                                <a slot="trigger" href="${import.meta.env.VITE_API_URL}/auth/login?returnURL=${import.meta.env.VITE_APP_URL}" data-icon>
                                    <i class="ph ph-sign-in"></i>
                                </a>
                                <p class="color-black text-sm">
                                    Inloggen
                                </p>
                            </x-tooltip>
                        `
    }
            </div>
        </header>
        <main>${children}</main>

        <!-- Toaster Container -->
        <div id="toaster" class="toaster hidden">
            <p>Je hebt ongelezen berichten!</p>
        </div>
    </div>
`;

}