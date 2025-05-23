import { router } from '@/http/router'
import { fetcher } from '@/utils'

export default function CategoryEditPage({ params }) {
    CategoryEditPage.params = params;
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
            <h1 slot="title">Categorie aanpassen</h1>
            <p slot="subtitle">Pas de gegevens van deze categorie aan en sla ze op.</p>
        </x-page-header>

        <div class="page-container">
            <x-sidebar id="sidebar"></x-sidebar>
            <div id="form-wrapper">
                <form id="edit-form" class="space-y-6">
                    <div>
                        <label for="value" class="block text-sm font-medium text-gray-800 mb-1">Naam</label>
                        <x-input id="value" placeholder="Bijv. Data & AI"></x-input>
                    </div>
                    <div>
                        <label for="primaryColor" class="block text-sm font-medium text-gray-800 mb-1">Primaire kleur</label>
                        <x-input id="primaryColor" placeholder="#FACC15"></x-input>
                    </div>
                    <div>
                        <label for="accentColor" class="block text-sm font-medium text-gray-800 mb-1">Accentkleur</label>
                        <x-input id="accentColor" placeholder="#FDE68A"></x-input>
                    </div>
                    <div>
                        <label for="position" class="block text-sm font-medium text-gray-800 mb-1">Positie</label>
                        <x-input id="position" type="number" placeholder="Bijv. 1"></x-input>
                    </div>

                    <div class="flex justify-end gap-3 pt-4">
                        <button type="button" id="cancelBtn" class="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">Annuleren</button>
                        <button type="submit" id="saveBtn" class="px-5 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white">Opslaan</button>
                    </div>
                </form>
            </div>
        </div>
    `
}

CategoryEditPage.onPageLoaded = async () => {
    const { uuid: id } = CategoryEditPage.params;

    const form = document.querySelector('#edit-form')
    if (!form) return console.error('Form not found')

    const valueInput = form.querySelector('#value')
    const primaryColorInput = form.querySelector('#primaryColor')
    const accentColorInput = form.querySelector('#accentColor')
    const positionInput = form.querySelector('#position')
    const cancelBtn = form.querySelector('#cancelBtn')

    let category
    try {
        category = await fetcher(`category/${id}`)
    } catch (error) {
        console.error('Failed to load category', error)
        return
    }

    // Pre-fill values
    valueInput.value = category.value ?? ''
    primaryColorInput.value = category.primaryColor ?? ''
    accentColorInput.value = category.accentColor ?? ''
    positionInput.value = category.position ?? ''

    form.addEventListener('submit', async (e) => {
        e.preventDefault()

        const updatedCategory = {
            id,
            value: valueInput.value,
            primaryColor: primaryColorInput.value,
            accentColor: accentColorInput.value,
            position: parseInt(positionInput.value) || null,
        }

        try {
            await fetcher(`category/${id}`, {
                method: 'PUT',
                body: updatedCategory,
            })

            router.navigate('/categorien')
        } catch (err) {
            console.error('Update failed:', err)
        }
    })

    cancelBtn.addEventListener('click', () => {
        router.navigate('/categorien')
    })
}
