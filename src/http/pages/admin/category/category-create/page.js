import { router } from '@/http/router'
import { fetcher } from '@/utils'

export default function CategoryCreatePage() {
    return /*html*/ `
        <style>
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
                #sidebar {
                    display: unset;
                }
            }

            #form-wrapper {
                padding: 24px;
                width: 95%;
                margin: 0 auto;
            }

            @media (min-width: 640px) {
                #form-wrapper {
                    width: 80%;
                }
            }
            label {
                margin-top: 10px;
            }
        </style>

        <x-page-header>
            <h1 slot="title">Nieuwe categorie toevoegen</h1>
            <p slot="subtitle">Gebruik het formulier hieronder om een nieuwe categorie aan te maken.</p>
        </x-page-header>

        <div class="page-container">
            <x-sidebar id="sidebar"></x-sidebar>

            <div id="form-wrapper">
                <form id="create-form" class="space-y-6">
                    <div>
                        <label for="value" class="block text-sm font-medium text-gray-800 mb-1">Naam</label>
                        <x-input id="value" placeholder="Bijv. Software Development"></x-input>
                    </div>

                    <div>
                        <label for="primaryColor" class="block text-sm font-medium text-gray-800 mb-1">Primaire kleur</label>
                        <input type="color" id="primaryColor" value="#ff0000" style="width:85%;">
                    </div>

                    <div>
                        <label for="accentColor" class="block text-sm font-medium text-gray-800 mb-1">Accentkleur</label>
                        <input type="color" id="accentColor" value="#ff0000" style="width:85%;">
                    </div>

                    <div>
                        <label for="position" class="block text-sm font-medium text-gray-800 mb-1">Positie</label>
                        <x-input id="position" type="number" placeholder="Bijv. 1"></x-input>
                    </div>

                    <div class="flex justify-end">
                        <button type="submit" style="margin-top: 20px">
                            Opslaan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `
}

CategoryCreatePage.onPageLoaded = () => {
    const form = document.querySelector('#create-form')

    form?.addEventListener('submit', async (e) => {
        e.preventDefault()

        const newCategory = {
            value: form.querySelector('#value').value,
            primaryColor: form.querySelector('#primaryColor').value.toUpperCase(),
            accentColor: form.querySelector('#accentColor').value.toUpperCase(),
            position: parseInt(form.querySelector('#position').value) || null,
        }

        try {
            await fetcher('category', {
                method: 'POST',
                body: newCategory,
            })

            router.navigate('/admin/categorien')
        } catch (err) {
            console.error('Create failed:', err)
        }
    })
}
