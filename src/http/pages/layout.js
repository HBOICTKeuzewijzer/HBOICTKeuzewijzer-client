export default function Layout(children) {
    const imageURL = new URL('@assets/images/windesheim-logo.png', import.meta.url).href

    return /*html*/ `
        <div>
            <header>
                <img src="${imageURL}"/>
                <div id="header-profile">
                    <x-tooltip side="left" align="top">
                        <a slot="trigger" href="/messages" class="icon-button">
                            <i class="ph ph-chat"></i>
                        </a>
                        Content
                    </x-tooltip>

                    <x-popover side="bottom" align="right">
                        <button slot="trigger" id="profile">
                        JK
                        </button>
                        asdasdasdasd
                    </x-popover>

                    <button class="icon-button">
                        <i class="ph ph-list"></i>
                    </button>
                </div>
            </header>
            <main>${children}</main>
        </div>
    `
}
