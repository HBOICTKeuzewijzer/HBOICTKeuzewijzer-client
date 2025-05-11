export default function Profile() {
    return /*html*/`
    <x-sidebar>
        <x-sidebar-button route="/profile/settings" >
            <i class="ph ph-pinwheel"></i>
            <p>Settings</p>
        </x-sidebar-button>
        <x-sidebar-button route="/profile/mijn-routes" >
            <i class="ph ph-route"></i>
            <p>Settings</p>
        </x-sidebar-button>
    </x-sidebar>
    `
}