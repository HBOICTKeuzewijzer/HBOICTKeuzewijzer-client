export default function Layout(children) {
    const imageURL = new URL('@assets/images/windesheim-logo.png', import.meta.url).href
    const hasSession = true

    return /*html*/ `
        <div>
            <header>
                <a href="/planner">
                    <img src="${imageURL}"/>
                </a>
                <div class="headerActions">
                    ${
                        hasSession
                            ? /*html*/ `
                                <x-tooltip location="bottom" placement="middle" class="hidden md:block">
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

                                <x-popover location="bottom" placement="right" class="hidden md:block">
                                    <button slot="trigger" id="profile">JK</button>
                                    <a popover-action danger href="https://api.hboictkeuzewijzer.nl/api/auth/logout" class="text-sm">
                                        <i class="ph-duotone ph-sign-out"></i>    
                                        Uitloggen
                                    </a>
                                </x-popover>
                            `
                            : /*html*/ `
                                <x-tooltip location="left" placement="middle" class="hidden md:block">
                                    <a slot="trigger" href="https://api.hboictkeuzewijzer.nl/api/auth/login" data-icon>
                                        <i class="ph ph-sign-in"></i>
                                    </a>
                                    <p class="color-black text-sm">
                                        Inloggen
                                    </p>
                                </x-tooltip>
                            `
                    }

                    <button data-icon class="block md:hidden">
                        <i class="ph ph-list"></i>
                    </button>
                </div>
            </header>
            <main>${children}</main>
        </div>
    `
}
