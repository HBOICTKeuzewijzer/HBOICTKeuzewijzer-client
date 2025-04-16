export default function AdminPage() {
    return /*html*/ `
        <div id="admindiv">
            <x-data-table caption="Modules">

            </x-data-table>
        </div>
    `
}



AdminPage.onPageLoaded = () => {
    const table = document.querySelector("#admindiv x-data-table");

    table.dataTable({
        route: "module",
        columns: [
            { path: "id", title: "Id", sorting: true },
            { path: "name", title: "Naam", sorting: true },
            { path: "category", title: "Categorie", sorting: true },
            { path: "eCs", title: "Credits" },
            {
                path: "enabled", title: "Enabled", render: function (data) {
                    return data ? "enabled" : "disabled"
                }
            },
        ],
        searching: true,
        paging: true,
        pageSize: 10,
        buttons: {
            edit: function (rowdata) {
                console.log(rowdata)
                console.log("edit")
            },
            delete: function (rowdata) {
                console.log(rowdata)
                console.log("delete")
            },
            inspect: function (rowdata) {
                console.log(rowdata)
                console.log("inspect")
            },
            create: function () {
                console.log("create")
            }
        }
    })
}

AdminPage.onBeforePageUnloaded = () => {
    console.log("page unloaded")
}