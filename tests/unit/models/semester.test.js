import { describe, it, expect } from 'vitest'
import { Semester } from '@models'

/**
 * Semester model tests
 * ------------------------------------
 * This suite validates the functionality of the `Semester` model by testing:
 * - Initialization with complete and partial input,
 * - Default handling of optional properties,
 * - Getter/setter behavior.
 */
describe('[Models] Semester', () => {
    it('[Should] Initialize a semester with supported properties', () => {
        const semester = new Semester({
            id: 'sem-1',
            index: 1,
            acquiredECs: 30,
            moduleId: 'mod-1',
            customModuleId: 'custom-1',
            studyRouteId: 'route-1',
        })

        expect(semester.id).toBe('sem-1')
        expect(semester.index).toBe(1)
        expect(semester.acquiredECs).toBe(30)
        expect(semester.moduleId).toBe('mod-1')
        expect(semester.customModuleId).toBe('custom-1')
        expect(semester.studyRouteId).toBe('route-1')
    })

    it('[Should] Handle absence of optional properties', () => {
        const semester = new Semester({
            id: 'sem-2',
        })

        expect(semester.index).toBeUndefined()
        expect(semester.acquiredECs).toBeUndefined()
        expect(semester.moduleId).toBeUndefined()
        expect(semester.customModuleId).toBeUndefined()
        expect(semester.studyRouteId).toBeUndefined()
    })

    it('[Should] Allow updating properties via setters', () => {
        const semester = new Semester()

        semester.id = 'sem-3'
        semester.index = 2
        semester.acquiredECs = 15
        semester.moduleId = 'mod-2'
        semester.customModuleId = 'custom-2'
        semester.studyRouteId = 'route-2'

        expect(semester.id).toBe('sem-3')
        expect(semester.index).toBe(2)
        expect(semester.acquiredECs).toBe(15)
        expect(semester.moduleId).toBe('mod-2')
        expect(semester.customModuleId).toBe('custom-2')
        expect(semester.studyRouteId).toBe('route-2')
    })
        it('[Should] Accept a Module instance via the module property', () => {
        const moduleObj = { id: 'mod-obj', name: 'Module Object' }
        const semester = new Semester({
            id: 'sem-4',
            module: moduleObj,
        })

        expect(semester.id).toBe('sem-4')
        expect(semester.module).toBeDefined()
        expect(semester.module.id).toBe('mod-obj')
        expect(semester.module.name).toBe('Module Object')
    })
      it('[Should] Accept a CustomModule instance via the customModule property', () => {
        const customModuleObj = { id: 'custom-obj', name: 'Custom Module' }
        const semester = new Semester({
            id: 'sem-5',
            customModule: customModuleObj,
        })

        expect(semester.id).toBe('sem-5')
        expect(semester.customModule).toBeDefined()
        expect(semester.customModule.id).toBe('custom-obj')
        expect(semester.customModule.name).toBe('Custom Module')
    })
    
    
})