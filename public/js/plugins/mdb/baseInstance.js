export const initMdbModal = (el) => mdb.Modal.getOrCreateInstance(el);

export const showModal = (instance) => {

    if (!instance) return;

    instance.show();
}

export const hideModal = ({ el, instance, form }) => instance.hide();

export const initMdbWrapperInput = ({ selector, value }) => {

    const inputElement = document.querySelector(selector);

    if (!inputElement) return;

    const wrapper = inputElement.closest('.form-outline');
    inputElement.value = value || '';
    return mdb.Input.getOrCreateInstance(wrapper);
}

export const updateMdbWrapperInput = (instance) => {

    if (!instance) return;

    instance.update();
}