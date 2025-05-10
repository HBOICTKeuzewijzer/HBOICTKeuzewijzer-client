import { Auth } from '@utils'

export default function Layout(children) {
    const imageURL = new URL('@assets/images/windesheim-logo.png', import.meta.url).href
    const user = Auth.getUser()

    function getInitials(name) {
        if (!name) return ''

        const parts = name.trim().split(/\s+/)

        if (parts.length === 1) {
            return parts[0][0].toUpperCase()
        }

        const first = parts[0][0].toUpperCase()
        const last = parts[parts.length - 1][0].toUpperCase()

        return first + last
    }

    return /*html*/ `
        <div>
            <header>
                <a href="/">
                    <img src="${imageURL}"/>
                </a>
                <div class="headerActions">
                    ${
                        Auth.isLoggedIn
                            ? /*html*/ `
                                <x-tooltip position="left" placement="middle">
                                    <a slot="trigger" href="/messages" data-icon>
                                        <span style="position:relative;">
                                            <span class="relative flex size-3" style="position: absolute; display: flex; width: 8px; height: 8px; right: 0;">
                                                <span class="animate-ping"
                                                style="position: absolute; display:inline-flex; height: 100%; width: 100%; opacity: 75%; background-color: rgb(var(--color-light-pink)); border-radius: var(--rounded-full);"></span>
                                                <span
                                                style="position: relative; display:inline-flex; height: 8px; width: 8px; background-color: rgb(var(--color-red)); border-radius: var(--rounded-full);"></span>
                                            </span>
                                            <i class="ph ph-chat"></i>
                                        </span>
                                    </a>
                                    <p class="color-black text-sm">
                                        Berichten
                                    </p>
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
        </div>
    `
}
