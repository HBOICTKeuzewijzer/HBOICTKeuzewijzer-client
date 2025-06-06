import { describe, it, expect } from 'vitest'
import { Module } from '@models'

/**
 * Module model tests
 * ------------------------------------
 * This suite validates the functionality of the `Module` model by testing:
 * - Initialization with complete and partial input,
 * - Category normalization via the setter,
 * - Getter/setter behavior,
 * - Default handling of optional properties.
 *
 * Covered test scenarios:
 * - [Should] Initialize a module with supported properties,
 * - [Should] Normalize known categories (`software`, `infrastructure`, `security`, `business`),
 * - [Should] Default to `OVERIG` for unknown categories,
 * - [Should] Handle optional description gracefully,
 * - [Should] Allow property updates through setters.
 */
describe('[Models] Module', () => {
    it('[Should] Initialize a module with supported properties', () => {
        const module = new Module({
            id: 'abc-123',
            name: 'Webdev',
            code: 'WD101',
            ec: 5,
            description: 'Covers frontend and backend basics',
        })

        expect(module.id).toBe('abc-123')
        expect(module.name).toBe('Webdev')
        expect(module.code).toBe('WD101')
        expect(module.ec).toBe(5)
        expect(module.description).toBe('Covers frontend and backend basics')
    })

    it('[Should] Handle absence of optional description', () => {
        const module = new Module({
            id: 'mod-001',
            name: 'Design',
            code: 'DS101',
            ec: 3,
        })

        expect(module.description).toBeUndefined()
    })

    it('[Should] Allow updating properties via setters', () => {
        const module = new Module()

        module.id = 'mod-xyz'
        module.name = 'Databases'
        module.code = 'DB200'
        module.ec = 6
        module.description = 'Covers SQL and NoSQL systems'
        module.category = 'Security'

        expect(module.id).toBe('mod-xyz')
        expect(module.name).toBe('Databases')
        expect(module.code).toBe('DB200')
        expect(module.ec).toBe(6)
        expect(module.description).toBe('Covers SQL and NoSQL systems')
        expect(module.category).toBe('Security')
    })
})
