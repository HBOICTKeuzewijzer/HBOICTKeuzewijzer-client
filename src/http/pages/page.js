import '@components/save-button';
import { fetcher } from '@/utils';

export default function PlannerPage(params) {

    function groupModulesByCategory(modules) {
        return modules.reduce((acc, module) => {
            const category = module.category || 'OVERIG';

            if (!acc[category]) {
                acc[category] = [];
            }

            acc[category].push(module);

            return acc;
        }, {});
    }

    async function loadModules() {
        let modulesData = [];
        try {
            const response = await fetcher('module', { method: 'GET' });
            modulesData = response.items || [];

            const groupedModules = groupModulesByCategory(modulesData);

            renderModules(groupedModules);
        } catch (error) {
            console.error('Error fetching modules:', error);
        }
    }

    function renderModules(groupedModules) {
        const categoryTitles = {
            SE: 'Software Engineering',
            IDS: 'Infrastructure Design & Security',
            BIM: 'Business IT & Management',
            OVERIG: 'Overig',
        };

        const orderedCategories = ['SE', 'IDS', 'BIM', 'OVERIG'];
        const moduleItems = orderedCategories
            .filter(category => groupedModules[category])
            .map(category => {
                const categoryModules = groupedModules[category];
                const moduleItemsHTML = categoryModules.map(module => `
                    <div class="module-item">
                        <span>${module.name}</span>
                        <x-tooltip position="left" placement="middle">
                            <div slot="trigger" data-icon>
                                <i class="ph ph-info"></i>
                            </div>
                            <p class="color-black text-sm">
                                ${module.description || 'Geen beschrijving beschikbaar.'}
                            </p>
                        </x-tooltip>
                    </div>
                `).join('');

                return `
                    <x-accordion type="${category}">
                        <span slot="title">${categoryTitles[category] || category}</span>
                        ${moduleItemsHTML}
                    </x-accordion>
                `;
            }).join('');

        const lists = document.querySelectorAll('#modules-list');
        lists.forEach(list => {
            list.innerHTML = moduleItems;
        });
    }

    loadModules();

    const modulesContainerHTML = /*html*/ `
    <div style="display: flex; flex-direction: column; height: 100%;">
        
        <div style="padding: 24px 24px 0; display: flex; flex-direction: column; gap: 6px;">
            <h5 style="margin: 0; font-size: 18px;">Modules</h5>
            <div class="divider" style="background-color: rgb(var(--color-gray-4)); height:1px;"></div>
            <p style="margin: 0; font-size: 12px;">
                Dit zijn alle beschikbare modules waaruit je kunt kiezen. Als je een externe module wilt volgen, kun je deze toevoegen via de 'Anders' optie onder 'Overig'.
            </p>
        </div>

        <div id="modules-list" style="display: flex; flex-direction: column; padding: 24px;">
        </div>
        
    </div>
`;

    return /*html*/ `
        <div class="container">
            <x-sheet class="hidden md:flex" side="left" open floating>
                ${modulesContainerHTML}
            </x-sheet>

            <x-drawer class="md:hidden" open>
                ${modulesContainerHTML}
            </x-drawer>

            <save-share-button>
                <span slot="icon">Opslaan</span>
            </save-share-button>
        </div>
    `;
}
