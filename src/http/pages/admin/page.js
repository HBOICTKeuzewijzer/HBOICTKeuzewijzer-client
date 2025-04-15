export default function AdminPage() {
    return /*html*/ `
        <div id="admindiv">
            
            <a href="/">home</a>
        </div>
    `
}

AdminPage.onPageLoaded = () => {
    console.log("page loaded")
    console.log(document.querySelector("#admindiv"))
}

AdminPage.onBeforePageUnloaded = () => {
    console.log("page unloaded")
}