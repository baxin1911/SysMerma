import { getErrorMessage } from "../constants/apiMessages.js";
import { reloadMainTable } from "../plugins/datatable/baseDatatable.js";
import { notifications } from "../plugins/swal/swalComponent.js";
import { closeModal } from "../ui/modalUI.js";

export const handleSubmit = async ({ form, formData, create, update }) => {
    
    const id = form.dataset.id;
    const mode = form.dataset.mode;
    let response;

    if (mode === 'create') response = await create(formData);
    else {

        if (!id) notifications.showError('No hay registro seleccionado.');
        response = await update(formData, id);
    }

    notifications.showSuccess(response.message);
    closeModal(form);
    reloadMainTable();

    return response.data;
}

export const handleAction = async ({ action, formId }) => {

    try {

        const form = document.querySelector(formId);
        const id = form.dataset.id;

        if (!id) notifications.showError('No hay registro seleccionado.');

        const response = await action(id);

        notifications.showSuccess(response.message);
        closeModal(form);
        reloadMainTable();

    } catch (err) {

        notifications.showError(err.message);
    }
}

export const cleanForm = (form) => {

    form.reset();
    form.dataset.id = '';
    form.dataset.mode = '';
}

export const validateFields = (validators, formData) => {

    const errors = {};

    Object.keys(validators).forEach(field => {
        const error = validators[field](formData[field]);

        errors[field] = error;
    });

    return errors;
}

export const hasValidationErrors = (errors) => Object.values(errors).some(error => error);

export const validateDetailsFields = (validators, details) => {

    const errors = {};

    details.forEach(detail => {

        const detailErrors = validateFields(validators, detail);
        const hasErrors = Object.values(detailErrors).some(Boolean);

        if (hasErrors) errors[detail.id] = detailErrors;
    })

    return errors;
}

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj ?? {}, key);
const isObject = (value) => typeof value === 'object' && value !== null;
const isErrorCodeObject = (error) => isObject(error) && hasOwn(error, 'code');
const isPathErrorObject = (error) => isObject(error) && hasOwn(error, 'path');

const mergeServerErrorList = (errors) => errors.reduce((result, error) => {

    if (isPathErrorObject(error)) {
        result[error.path] = hasOwn(error, 'msg') ? mapServerErrors(error.msg) : null;
        return result;
    }

    const mappedError = mapServerErrors(error);

    if (isObject(mappedError)) {
        Object.assign(result, mappedError);
    }

    return result;
}, {});

export const mapServerErrors = (errors) => {

    if (Array.isArray(errors)) {
        return mergeServerErrorList(errors);
    }

    if (isObject(errors)) {

        if (isErrorCodeObject(errors)) {
            return getErrorMessage(errors);
        }

        const result = {};

        for (const key in errors) {
            result[key] = mapServerErrors(errors[key]);
        }

        return result;
    }

    return null;
};
