export const on = (event, selector, handler, options = {}) => {

    document.addEventListener(event, e => {

        const element = e.target.closest(selector);

        if (!element || !document.contains(element)) return;

        handler(e, element);
    }, options);
}