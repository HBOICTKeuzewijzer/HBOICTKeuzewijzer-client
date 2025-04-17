/**
 * Creates a template from a tagged HTML string.
 * @param {TemplateStringsArray} strings 
 * @param  {...any} values 
 * @returns {HTMLTemplateElement}
 */
export function html(strings, ...values) {
    const template = document.createElement('template');
    template.innerHTML = String.raw({ raw: strings }, ...values);
    return template;
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
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}