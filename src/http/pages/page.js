export default function HomePage(params) {
    let element = document.querySelector('x-sheet#modulesSelector')
    console.log(element)

    return `
        <div style="position:relative;">
            <x-sheet id="modulesSelector">s</x-sheet>
        </div>
        <div class="container">
        </div>
    `
}
