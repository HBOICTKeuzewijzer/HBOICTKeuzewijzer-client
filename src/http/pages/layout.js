import Role from "@/models/role"

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

    return /*html*/ `
        <div>
            <x-header>
                <img src="${imageURL}" slot="logo"/>

                <x-header-link slot="links" path='/guest' authenticated='false'>Guest</x-header-link>
                <x-header-link slot="links" path='/profile/mijn-routes' authenticated='true' roles='${roleArray([Role.Student])}'>Mijn routes</x-header-link>
                <x-header-link slot="links" path="/admin">
                    Admin
                    <x-header-link slot="dropdown" path="/admin/modules">Modules</x-header-link>
                    <x-header-link slot="dropdown" path="/admin/oer">OER</x-header-link>
                    <x-header-link slot="dropdown" path="/admin/categorien">Categorieën</x-header-link>
                    <x-header-link slot="dropdown" path="/admin/rollen-toewijzen">Rollen toewijzen</x-header-link>
                    <x-header-link slot="dropdown" path="/admin/slb-relaties">SLB relaties</x-header-link>
                </x-header-link>
                
                <i class="ph ph-list" slot="mob-icon" style="font-size: 30px;" ></i>
            </x-header>
            <main>${children}</main>
        </div>
    `
}

