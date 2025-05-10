import { router } from '@/http/router'
import { fetcher } from '@/utils'

export default function ModulesEditPage({ params }) {
    ModulesEditPage.params = params // temporarily stash the params
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
            <h1 slot="title">Module aanpassen</h1>
            <p slot="subtitle">Pas de gegevens van deze module aan en sla ze op.</p>
        </x-page-header>

        <div class="page-container">
            <x-sidebar id="sidebar"></x-sidebar>
            <div id="form-wrapper">
                <form id="edit-form" class="space-y-6">
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

                    <div class="flex justify-end gap-3 pt-4" style="margin-top: 20px">
                        <button type="button" id="cancelBtn" class="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">Annuleren</button>
                        <button type="submit" id="saveBtn" class="px-5 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white">Opslaan</button>
                    </div>
                </form>
            </div>
        </div>
    `
}

ModulesEditPage.onPageLoaded = async () => {
    const { uuid: id } = ModulesEditPage.params

    const form = document.querySelector('#edit-form')
    if (!form) {
        console.error('Form not found in DOM.')
        return
    }

    const name = form.querySelector('#name')
    const code = form.querySelector('#code')
    const ecs = form.querySelector('#ecs')
    const level = form.querySelector('#level')
    const description = form.querySelector('#description')
    const categorySelect = form.querySelector('#category')
    const oerSelect = form.querySelector('#oer')
    const cancelBtn = form.querySelector('#cancelBtn')

    const [module, categories, oers] = await Promise.all([
        fetcher(`module/${id}`),
        fetcher('category'),
        fetcher('oer'),
    ])

    // Fill dropdowns
    categories?.forEach(cat => {
        const opt = document.createElement('option')
        opt.value = cat.id
        opt.textContent = cat.value ?? 'Categorie'
        categorySelect.appendChild(opt)
    })

    oers?.forEach(oer => {
        const opt = document.createElement('option')
        opt.value = oer.id
        opt.textContent = oer.academicYear ?? 'OER'
        oerSelect.appendChild(opt)
    })

    // Fill form fields
    name.value = module.name
    code.value = module.code
    ecs.value = module.eCs
    level.value = module.level
    description.shadowRoot.querySelector('textarea').value = module.description ?? ''
    categorySelect.value = module.categoryId ?? ''
    oerSelect.value = module.oerId ?? ''

    form.addEventListener('submit', async (e) => {
        e.preventDefault()

        const updated = {
            id,
            name: name.value,
            code: code.value,
            description: description.shadowRoot.querySelector('textarea').value,
            eCs: parseInt(ecs.value),
            level: parseInt(level.value),
            prerequisiteJson: module.prerequisiteJson ?? '[]',
            categoryId: categorySelect.value || null,
            oerId: oerSelect.value || null,
        }

        try {
            await fetcher(`module/${id}`, {
                method: 'PUT',
                body: updated,
            })

            router.navigate('/admin/modules')
        } catch (err) {
            console.error('Update failed:', err)
        }
    })

    cancelBtn.addEventListener('click', () => {
        router.navigate('/admin/modules')
    })
}
