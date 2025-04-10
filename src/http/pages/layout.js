export default function Layout(children) {
    const imageURL = new URL('@assets/images/windesheim-logo.png', import.meta.url).href
    const hasSession = false

    return /*html*/ `
        <div>
            <header>
                <img src="${imageURL}"/>
                <div class="headerActions">
                    ${
                        hasSession
                            ? /*html*/`
                                <x-tooltip location="bottom" placement="top" class="hidden md-block">
                                    <a slot="trigger" href="/messages" data-icon>
                                        <i class="ph ph-chat"></i>
                                    </a>
                                    <p class="color-black text-sm">
                                        Berichten
                                    </p>
                                </x-tooltip>

                                <x-popover location="bottom" placement="right" class="hidden md-block">
                                    <button slot="trigger" id="profile">JK</button>
                                    <div>
                                        <!-- popover content -->
                                    </div>
                                </x-popover>
                            `
                            : /*html*/`
                                <x-tooltip location="left" placement="middle" class="hidden md-block">
                                    <a slot="trigger" href="/login" data-icon>
                                        <i class="ph ph-sign-in"></i>
                                    </a>
                                    <p class="color-black text-sm">
                                        Inloggen
                                    </p>
                                </x-tooltip>
                            `
                    }

                    <button data-icon class="block md-hidden">
                        <i class="ph ph-list"></i>
                    </button>
                </div>
            </header>
            <main>${children}</main>
        </div>
    `
}
