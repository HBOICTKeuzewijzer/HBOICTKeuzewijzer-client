/**
 * Creates a template from a tagged HTML string.
 * @param {TemplateStringsArray} strings
 * @param  {...any} values
 * @returns {HTMLTemplateElement}
 */
export function html(strings, ...values) {
    const template = document.createElement('template')
    template.innerHTML = String.raw({ raw: strings }, ...values)
    return template
}

/**
 * Returns data at path from given object. Take the following:
 * {
 *      data: {
 *          id: 1,
 *          name: "Jarne",
 *          job: "Crazy person"
 *      }
 * }
 * And given a path of "data.job"  will return "Crazy person"
 * @param {Object} obj Object to take from.
 * @param {string} path Path to field to retrieve.
 * @returns Retrieved data from object at path.
 */
export function resolvePath(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}


/**
 * Calls a specified function after delay ms
 * @param {Function} fn To call after delay
 * @param {number} delay Delay in ms
 * @returns 
 */
export function debounce(fn, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}