export default function Layout(children) {
    const imageURL = new URL('@public/assets/images/windesheim-logo.png', import.meta.url).href

    return /*html*/ `
        <div>
            <header>
                <img src="${imageURL}"/>
                <div id="header-profile">
                    <a href="/messages" class="icon-button">
                        <i class="ph ph-chat"></i>
                    </a>
                    <button id="profile">
                        JK
                    </button>
                    <button class="icon-button">
                        <i class="ph ph-list"></i>
                    </button>
                </div>
            </header>
            <main>${children}</main>
        </div>
    `
}
