import Role from "@/models/role"
import { router } from "../router"
import { Auth } from "@/utils"

function afterReturn() {
    const profileBtns = document.querySelectorAll(".header-a-tags")
    profileBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault()

            const aTag = e.target.closest('a')

            const route = aTag.getAttribute("href")

            if (route !== null) {
                router.navigate(route)
            }
        })
    })
}

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

export default function Layout(children) {
    function roleArray(roles) {
        let str = JSON.stringify(roles)
        return str
    }

    const imageURL = new URL('@assets/images/windesheim-logo.png', import.meta.url).href

    setTimeout(() => {
        afterReturn()
    }, 0);

    return /*html*/ `
        <div>
            <x-header>
                <img src="${imageURL}" slot="logo"/>

                <x-header-link slot="links" path='/guest' authenticated='false'>Guest</x-header-link>
                <x-header-link slot="links" path='/profile/mijn-routes' authenticated='true' roles='${roleArray([Role.Student])}'>Mijn routes</x-header-link>
                <x-header-link slot="links" path="/admin" authenticated='true' roles='${roleArray([Role.ModuleAdmin, Role.SystemAdmin])}'>
                    Admin
                    <x-header-link slot="dropdown" path="/admin/modules" authenticated='true' roles='${roleArray([Role.ModuleAdmin, Role.SystemAdmin])}'>Modules</x-header-link>
                    <x-header-link slot="dropdown" path="/admin/oer" authenticated='true' roles='${roleArray([Role.ModuleAdmin, Role.SystemAdmin])}'>OER</x-header-link>
                    <x-header-link slot="dropdown" path="/admin/categorien" authenticated='true' roles='${roleArray([Role.ModuleAdmin, Role.SystemAdmin])}'>Categorieën</x-header-link>
                    <x-header-link slot="dropdown" path="/admin/slb-relaties" authenticated='true' roles='${roleArray([Role.SystemAdmin])}'>SLB relaties</x-header-link>
                </x-header-link>

            ${Auth.isLoggedIn() ? /*html*/`
                <x-tooltip position="left" placement="bottom" slot="messages" style="height: 100%">
                    <a slot="trigger" id="messages" href="/messages" data-icon class="header-a-tags">
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

                <x-popover position="bottom" slot="profile" placement="right">
                    <button slot="trigger" id="profile">${getInitials(Auth.getUser()?.displayName)}</button>
                    
                    <a href="/profile/settings" popover-action class="text-sm action-link header-a-tags">
                        <i class="ph-duotone ph-gear"></i>
                        Instellingen
                    </a>
                    <a href="/logout" popover-action danger class="text-sm action-link header-a-tags">
                        <i class="ph-duotone ph-sign-out"></i>
                        Uitloggen
                    </a>
                </x-popover>
                ` : /*html*/`
                <a href="/login?returnUrl=${location.href}" class="text-sm action-link header-a-tags" slot="profile">
                    <i class="ph-duotone ph-sign-in"></i>
                </a>
                `}

                <i class="ph ph-list" slot="mob-icon" style="font-size: 30px;" ></i>
            </x-header>
            <main>${children}</main>
        </div>
    `
}

