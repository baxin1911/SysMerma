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

        if (!id) {
            
            notifications.showError('No hay registro seleccionado.');
            return;
        }

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

        if (!id) {
            
            notifications.showError('No hay registro seleccionado.');
            return;
        }

        const response = await action(id);

        notifications.showSuccess(response.message);
        closeModal(form);
        reloadMainTable();

    } catch (err) {

        notifications.showError(err.message);
    }
}

export const toggleDisabledElement = ({ element, isDisabled }) => {

    if (!element) return;

    element.classList.toggle('disabled', isDisabled);

    if ('disabled' in element) {
        element.disabled = isDisabled;
    }
};

export const toggleContainerElements = ({
    selector,
    isDisabled = true,
    root = document
}) => {

    const container = root?.querySelector(selector);

    if (!container) return;

    container
        .querySelectorAll('input, select, textarea, button')
        .forEach(element => {

            toggleDisabledElement({
                element,
                isDisabled
            });
        });
};

export const cleanForm = (form) => {

    form.reset();
    form.dataset.id = '';
    form.dataset.mode = '';
}

export const hasValidationErrors = (errors) => {

    const check = (value) => {

        if (value == null) return false;

        if (typeof value !== 'object') return true;

        return Object.values(value).some(check);
    };

    return check(errors);
};

export const validateFields = (validators, formData) => {

    const errors = {};

    Object.keys(validators).forEach(field => {
        const error = validators[field](formData[field]);

        errors[field] = error;
    });

    return errors;
}

export const validateDetailsFields = (validators, details) => {

    const errors = {};

    details.forEach(detail => {

        const detailErrors = validateFields(validators, detail);
        errors[detail.id] = detailErrors;
    });

    return errors;
}

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
const isObject = (value) => typeof value === 'object' && value !== null;
const isErrorCodeObject = (error) => isObject(error) && hasOwn(error, 'code');
const isPathErrorObject = (error) => isObject(error) && hasOwn(error, 'path') && hasOwn(error, 'msg');

const mergeServerErrorList = (errors) => errors.reduce((result, error) => {

    if (isPathErrorObject(error)) {

        result[error.path] = mapServerErrors(error.msg);

        return result;
    }

    const mappedError = mapServerErrors(error);

    if (isObject(mappedError)) Object.assign(result, mappedError);

    return result;
}, {});

export const mapServerErrors = (errors) => {

    if (Array.isArray(errors)) return mergeServerErrorsList(errors);

    if (isObject(errors)) {

        if (isErrorCodeObject(errors)) return getErrorMessage(errors) ?? errors;

        const result = {};

        for (const key in errors) {
            result[key] = mapServerErrors(errors[key]);
        }

        return result;
    }

    return null;
};