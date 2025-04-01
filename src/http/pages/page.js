export default function HomePage(params) {
    console.log(params)

    return /*html*/ `
        <x-sheet id="modulesSelector" open>
            <span style="display: flex; flex-direction: column; gap: 4px;">
                <h5 style="margin: 0; font-size: 20px;">Modules</h1>
                <div class="divider" style="background-color: rgb(var(--color-gray-4)); height:1px;"></div>
                <p style="margin: 0; font-size: 12px;">
                    Dit zijn alle beschikbare modules waaruit je kunt kiezen. Als je een externe module wilt volgen, kun je deze toevoegen via de 'Anders' optie onder 'Overig'.
                </p>
            </span>
        </x-sheet>
        <div class="container">
        </div>
    `
}
