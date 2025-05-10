import { router } from '@/http/router'
import { fetcher } from '@/utils'

export default function ModulesCreatePage() {
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
            <h1 slot="title">Nieuwe module toevoegen</h1>
            <p slot="subtitle">Gebruik het formulier hieronder om een nieuwe module aan te maken.</p>
        </x-page-header>

        <div class="page-container">
            <x-sidebar id="sidebar"></x-sidebar>

            <div id="form-wrapper">
                <form id="create-form" class="space-y-6">
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-800 mb-1">Naam</label>
                        <x-input id="name" placeholder="Naam van de module"></x-input>
                    </div>
                    <div>
                        <label for="code" class="block text-sm font-medium text-gray-800 mb-1">Code</label>
                        <x-input id="code" placeholder="Bijv. SD101"></x-input>
                    </div>
                    <div>
                        <label for="ecs" class="block text-sm font-medium text-gray-800 mb-1">EC's</label>
                        <x-input id="ecs" type="number" placeholder="Bijv. 5"></x-input>
                    </div>
                    <div>
                        <label for="level" class="block text-sm font-medium text-gray-800 mb-1">Niveau</label>
                        <x-input id="level" type="number" placeholder="Bijv. 2"></x-input>
                    </div>
                    <div>
                        <label for="description" class="block text-sm font-medium text-gray-800 mb-1">Beschrijving</label>
                        <x-multiline-input id="description" placeholder="Beschrijving van de module"></x-multiline-input>
                    </div>

                    <div>
                        <label for="category" class="block text-sm font-medium text-gray-800 mb-1">Categorie</label>
                        <select id="category" class="w-full rounded-lg border px-4 py-2 bg-gray-50">
                            <option value="">Kies een categorie</option>
                        </select>
                    </div>

                    <div>
                        <label for="oer" class="block text-sm font-medium text-gray-800 mb-1">OER</label>
                        <select id="oer" class="w-full rounded-lg border px-4 py-2 bg-gray-50">
                            <option value="">Kies een OER</option>
                        </select>
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

ModulesCreatePage.onPageLoaded = () => {
    const form = document.querySelector('#create-form')

    form?.addEventListener('submit', async (e) => {
        e.preventDefault()

        const newModule = {
            name: form.querySelector('#name').value,
            code: form.querySelector('#code').value,
            description: form.querySelector('#description')?.shadowRoot?.querySelector('textarea')?.value ?? '',
            eCs: parseInt(form.querySelector('#ecs').value),
            level: parseInt(form.querySelector('#level').value),
            prerequisiteJson: '[]',
            categoryId: form.querySelector('#category').value || null,
            oerId: form.querySelector('#oer').value || null,
        }

        try {
            await fetcher('module', {
                method: 'POST',
                body: newModule,
            })

            router.navigate('/admin/modules')
        } catch (err) {
            console.error('Create failed:', err)
        }
    })

    // Populate category dropdown
    fetcher('category').then(data => {
        const select = document.querySelector('#category')
        data?.forEach(cat => {
            const opt = document.createElement('option')
            opt.value = cat.id
            opt.textContent = cat.value ?? 'Categorie'
            select.appendChild(opt)
        })
    }).catch(console.error)

    // Populate OER dropdown
    fetcher('oer').then(data => {
        const select = document.querySelector('#oer')
        data?.forEach(oer => {
            const opt = document.createElement('option')
            opt.value = oer.id
            opt.textContent = oer.academicYear ?? 'OER'
            select.appendChild(opt)
        })
    }).catch(console.error)
}
