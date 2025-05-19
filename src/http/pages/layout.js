import Role from "@/models/role"
import { router } from "../router"
import { Auth } from "@/utils"

function afterReturn() {
    const profileBtns = document.querySelectorAll(".action-link")
    profileBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault()

            const route = e.target.getAttribute("href")

            if (route !== null) {
                router.navigate(route)
            }
        })
    })
}

export default function Layout(children) {
    // const user = Auth.getUser()

    // console.log(Auth.isLoggedIn())

    // function getInitials(name) {
    //     if (!name) return ''

    //     const parts = name.trim().split(/\s+/)

    //     if (parts.length === 1) {
    //         return parts[0][0].toUpperCase()
    //     }

    //     const first = parts[0][0].toUpperCase()
    //     const last = parts[parts.length - 1][0].toUpperCase()

    //     return first + last
    // }

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
                    <x-header-link slot="dropdown" path="/admin/modules" roles='${roleArray([Role.ModuleAdmin, Role.SystemAdmin])}'>Modules</x-header-link>
                    <x-header-link slot="dropdown" path="/admin/oer" roles='${roleArray([Role.ModuleAdmin, Role.SystemAdmin])}'>OER</x-header-link>
                    <x-header-link slot="dropdown" path="/admin/categorien" roles='${roleArray([Role.ModuleAdmin, Role.SystemAdmin])}'>Categorieën</x-header-link>
                    <x-header-link slot="dropdown" path="/admin/slb-relaties" roles='${roleArray([Role.SystemAdmin])}'>SLB relaties</x-header-link>
                </x-header-link>

            ${Auth.isLoggedIn() ? /*html*/`
                <x-popover position="bottom" slot="profile" placement="right">
                    <button slot="trigger" id="profile">JK</button>
                    
                    <a href="/profile/settings" popover-action class="text-sm action-link">
                        <i class="ph-duotone ph-gear"></i>
                        Instellingen
                    </a>
                    <a href="/logout" id="action-link" popover-action danger class="text-sm action-link">
                        <i class="ph-duotone ph-sign-out"></i>
                        Uitloggen
                    </a>
                </x-popover>
                ` : /*html*/`
                <x-header-link slot="links" path='/login' authenticated='false'>Inloggen</x-header-link>
                `}

                <i class="ph ph-list" slot="mob-icon" style="font-size: 30px;" ></i>
            </x-header>
            <main>${children}</main>
        </div>
    `
}

