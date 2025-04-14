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