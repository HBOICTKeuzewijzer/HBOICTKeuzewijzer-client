import { describe, it, expect } from 'vitest'
import { CustomModule } from '@models'

/**
 * CustomModule model tests
 * ------------------------------------
 * This suite validates the functionality of the `CustomModule` model by testing:
 * - Initialization with complete and partial input,
 * - Getter/setter behavior,
 * - Fallback to default values,
 * - Validation of the JSON-export by toJson().
 *
 * Covered test scenario's:
 * - [Should] Initialize a custom module with supported properties,
 * - [Should] Handle optional parameters gracefully,
 * - [Should] Set `isCustom` to true if this is unset,
 * - [Should] Allow property updates through setters,
 * - [Should] Return correct object with toJson.
 */
describe('[Models] CustomModule', () => {
  it('[Should] Initialize with full properties', () => {
    // Arrange
    const params = {
      id: 'cust-001',
      name: 'AI Basics',
      description: 'Intro to AI',
      ec: 5,
      semester: 2,
      isCustom: true
    }

    // Act
    const mod = new CustomModule(params)

    // Assert
    expect(mod.id).toBe('cust-001')
    expect(mod.name).toBe('AI Basics')
    expect(mod.description).toBe('Intro to AI')
    expect(mod.ec).toBe(5)
    expect(mod.semester).toBe(2)
    expect(mod.isCustom).toBe(true)
  })

  it('[Should] Default isCustom to true if not provided', () => {
    // Arrange
    const params = {
      id: 'cust-002',
      name: 'UX',
      ec: 3
    }

    // Act
    const mod = new CustomModule(params)

    // Assert
    expect(mod.isCustom).toBe(true)
  })

  it('[Should] Handle undefined description gracefully', () => {
    // Arrange
    const params = {
      id: 'cust-003',
      name: 'No Desc',
      ec: 2
    }

    // Act
    const mod = new CustomModule(params)

    // Assert
    expect(mod.description).toBeUndefined()
  })

  it('[Should] Allow updating properties via setters', () => {
    // Arrange
    const mod = new CustomModule()

    // Act
    mod.id = 'mod-004'
    mod.name = 'Cybersecurity'
    mod.description = 'Covers basic security concepts'
    mod.ec = 6
    mod.semester = 1
    mod.isCustom = false

    // Assert
    expect(mod.id).toBe('mod-004')
    expect(mod.name).toBe('Cybersecurity')
    expect(mod.description).toBe('Covers basic security concepts')
    expect(mod.ec).toBe(6)
    expect(mod.semester).toBe(1)
    expect(mod.isCustom).toBe(false)
  })

  it('[Should] Return correct structure in toJson()', () => {
    // Arrange
    const mod = new CustomModule({
      name: 'Ethics',
      ec: 4,
      semester: 2
    })

    // Act
    const json = mod.toJson()

    // Assert
    expect(json).toEqual({
      name: 'Ethics',
      description: undefined,
      eCs: 4,
      semester: 2
    })
  })

  it('[Should] Support legacy eCs alias during construction', () => {
    // Arrange
    const mod = new CustomModule({
      name: 'TestMod',
      eCs: 3,
      semester: 1
    })

    // Act
    const json = mod.toJson()

    // Assert
    expect(mod.ec).toBe(3)
    expect(mod.toJson().eCs).toBe(3)
  })
})
