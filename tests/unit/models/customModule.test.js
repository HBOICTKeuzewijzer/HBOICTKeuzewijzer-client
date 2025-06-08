import { describe, it, expect } from 'vitest'
import { CustomModule } from '@models'

/**
 * CustomModule model tests
 * ------------------------------------
 * Deze suite valideert het gedrag van de CustomModule-klasse, inclusief:
 * - Initialisatie met volledige of gedeeltelijke parameters,
 * - Getter/setter gedrag,
 * - Fallback naar default waarden,
 * - Validatie van de JSON-export via toJson().
 *
 * Testscenario’s:
 * - [Should] Initialiseren met volledige eigenschappen,
 * - [Should] Correct omgaan met afwezige optionele velden,
 * - [Should] Standaard `isCustom` instellen op true als deze ontbreekt,
 * - [Should] Eigenschappen kunnen aanpassen via setters,
 * - [Should] toJson returnt correct object.
 */
describe('[Models] CustomModule', () => {
  it('[Should] Initialize with full properties', () => {
    const mod = new CustomModule({
      id: 'cust-001',
      name: 'AI Basics',
      description: 'Intro to AI',
      ec: 5,
      semester: 2,
      isCustom: true
    })

    expect(mod.id).toBe('cust-001')
    expect(mod.name).toBe('AI Basics')
    expect(mod.description).toBe('Intro to AI')
    expect(mod.ec).toBe(5)
    expect(mod.semester).toBe(2)
    expect(mod.isCustom).toBe(true)
  })

  it('[Should] Default isCustom to true if not provided', () => {
    const mod = new CustomModule({
      id: 'cust-002',
      name: 'UX',
      ec: 3
    })

    expect(mod.isCustom).toBe(true)
  })

  it('[Should] Handle undefined description gracefully', () => {
    const mod = new CustomModule({
      id: 'cust-003',
      name: 'No Desc',
      ec: 2
    })

    expect(mod.description).toBeUndefined()
  })

  it('[Should] Allow updating properties via setters', () => {
    const mod = new CustomModule()

    mod.id = 'mod-004'
    mod.name = 'Cybersecurity'
    mod.description = 'Covers basic security concepts'
    mod.ec = 6
    mod.semester = 1
    mod.isCustom = false

    expect(mod.id).toBe('mod-004')
    expect(mod.name).toBe('Cybersecurity')
    expect(mod.description).toBe('Covers basic security concepts')
    expect(mod.ec).toBe(6)
    expect(mod.semester).toBe(1)
    expect(mod.isCustom).toBe(false)
  })

  it('[Should] Return correct structure in toJson()', () => {
    const mod = new CustomModule({
      name: 'Ethics',
      ec: 4,
      semester: 2
    })

    const json = mod.toJson()

    expect(json).toEqual({
      name: 'Ethics',
      description: undefined,
      eCs: 4,
      semester: 2
    })
  })

  it('[Should] Support legacy eCs alias during construction', () => {
    const mod = new CustomModule({
      name: 'TestMod',
      eCs: 3,
      semester: 1
    })

    expect(mod.ec).toBe(3)
    expect(mod.toJson().eCs).toBe(3)
  })
})
