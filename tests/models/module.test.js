import { describe, it, expect } from 'vitest'
import { Module } from '@models'

/**
 * Module model tests
 * ------------------------------------
 * This suite validates the functionality of the `Module` model by testing:
 * - Initialization with complete and partial input,
 * - Category normalization logic,
 * - Getter/setter behavior,
 * - Default handling of optional properties.
 *
 * Covered test scenarios:
 * - [Should] Initialize a module with all properties,
 * - [Should] Normalize known categories (`software`, `infrastructure`, `security`, `business`),
 * - [Should] Default to `OVERIG` for unknown categories,
 * - [Should] Handle optional description gracefully,
 * - [Should] Allow property updates through setters.
 */
describe('[Models] Module', () => {
    it('[Should] Initialize a module with all properties', () => {
        const module = new Module({
            id: 'abc-123',
            name: 'Webdev',
            category: 'software',
            description: 'Covers frontend and backend basics',
        })

        expect(module.id).toBe('abc-123')
        expect(module.name).toBe('Webdev')
        expect(module.category).toBe(Module.CATEGORY_SOFTWARE)
        expect(module.description).toBe('Covers frontend and backend basics')
    })

    it('[Should] Normalize category to SE when given "software"', () => {
        const module = new Module({ category: 'Software' })
        expect(module.category).toBe(Module.CATEGORY_SOFTWARE)
    })

    it('[Should] Normalize category to IDS for "infrastructure" or "security"', () => {
        const infra = new Module({ category: 'Infrastructure' })
        const sec = new Module({ category: 'Security' })

        expect(infra.category).toBe(Module.CATEGORY_INFRASTRUCTURE)
        expect(sec.category).toBe(Module.CATEGORY_INFRASTRUCTURE)
    })

    it('[Should] Normalize category to BIM when given "business"', () => {
        const module = new Module({ category: 'business strategies' })
        expect(module.category).toBe(Module.CATEGORY_BUSINESS)
    })

    it('[Should] Default to OVERIG for unknown categories', () => {
        const module = new Module({ category: 'arts & crafts' })
        expect(module.category).toBe(Module.CATEGORY_REMAINDER)
    })

    it('[Should] Handle absence of optional description', () => {
        const module = new Module({ id: 'mod-001', name: 'Design', category: 'business' })
        expect(module.description).toBeUndefined()
    })

    it('[Should] Allow updating properties via setters', () => {
        const module = new Module()

        module.id = 'mod-xyz'
        module.name = 'Databases'
        module.category = 'Security'
        module.description = 'Covers SQL and NoSQL systems'

        expect(module.id).toBe('mod-xyz')
        expect(module.name).toBe('Databases')
        expect(module.category).toBe(Module.CATEGORY_INFRASTRUCTURE)
        expect(module.description).toBe('Covers SQL and NoSQL systems')
    })
})
