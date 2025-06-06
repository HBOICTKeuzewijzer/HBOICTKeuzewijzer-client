import { router } from '@/http/router'
import { fetcher } from '@/utils'

export default function OerEditPage({ params }) {
    OerEditPage.params = params;
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
            <h1 slot="title">Nieuw oer toevoegen</h1>
            <p slot="subtitle">Gebruik het formulier hieronder om een nieuw oer aan te maken.</p>
        </x-page-header>

        <div class="page-container">
            <x-sidebar id="sidebar"></x-sidebar>

            <div id="form-wrapper">
                <form id="create-form" class="space-y-6">
                    <div>
                        <label for="value" class="block text-sm font-medium text-gray-800 mb-1">School jaar</label>
                        <x-input id="year" placeholder="Bijv. 22/23"></x-input>
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

OerEditPage.onPageLoaded = async () => {
    const { uuid: id } = OerEditPage.params;
    const form = document.querySelector('#create-form')

    const valueInput = form.querySelector('#year')

    let oer
    try {
        oer = await fetcher(`oer/${id}`)
    }
    catch (error) {
        console.error('Failed to load category', error)
        return
    }

    valueInput.value = oer.academicYear ?? ''

    form?.addEventListener('submit', async (e) => {
        e.preventDefault()

        const newOer = {
            id: id,
            academicYear: form.querySelector('#year').value
        }

        try {
            await fetcher(`oer/${id}`, {
                method: 'PUT',
                body: newOer,
            })

            router.navigate('/admin/oer')
        } catch (err) {
            console.error('Create failed:', err)
        }
    })
}