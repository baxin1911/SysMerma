export const on = (event, selector, handler, options = {}) => {

    document.addEventListener(event, e => {

        const element = e.target.closest(selector);

        if (!element || !document.contains(element)) return;

        handler(e, element);
    }, options);
}

export const getSelectedOptionText = (selector, root = document) => {

    const select = root?.querySelector(selector);

    return select?.selectedOptions[0]?.text?.trim() || '';
};
