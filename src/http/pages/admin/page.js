export default function AdminPage() {
    return /*html*/ `
        <style>
            #table-div {
                padding: 24px;
                width: 95%;
                margin: 0 auto;
            }

            .page-container {
                display: flex;
                background-color: white;
                flex-grow: 1;
                overflow-y: auto;
            }

            #sidebar {
                display: none;
                flex-grow: 1;
            }

            @media (min-width: 640px) {
                #table-div {
                    width: 80%
                }

                #sidebar {
                    display: unset;
                }
            }

            label {
                margin-top: 10px;
            }
        </style>

        <div class="page-container">
            <x-sidebar id="sidebar"></x-sidebar>
        </div>
    `
}
