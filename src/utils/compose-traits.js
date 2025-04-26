/**
 * Composes multiple traits (mixins) into a single class.
 *
 * This utility function allows you to apply multiple traits (functions that return
 * a subclass of a base class) to a given base class. Each trait should accept a class
 * and return an extended class.
 *
 * @template {new (...args: any[]) => any} T
 * @param {T} Base - The base class to extend.
 * @param {...(function(T): T | null | undefined)} traits - A list of traits to apply to the base class.
 * Each trait must be a function that takes a class and returns a class, or `null`/`undefined`.
 * Invalid traits will be skipped with a console warning.
 * @returns {T} - The resulting class with all traits applied.
 *
 * @example
 * class MyElement extends composeTraits(HTMLElement, TraitA, TraitB, TraitC) {}
 */
export function composeTraits(Base, ...traits) {
    traits.forEach(Trait => {
        if (Trait && typeof Trait === 'function') {
            Base = Trait(Base)
        }
    })
    return Base
}
