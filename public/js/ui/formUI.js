import { initMdbWrapperInput, updateMdbWrapperInput } from "../plugins/mdb/baseInstance.js";

const TOTAL_FIELDS = {
    quantity: '#totalQuantityDisplayInput',
    net: '#totalNetPurchaseAmountDisplayInput',
    gross: '#totalGrossPurchaseAmountDisplayInput',
}
const MODE_EDIT_DETAIL = 'edit-detail';
const MODE_VIEW = 'view';

export const initForm = ({
    form, 
    mode, 
    id = ''
}) => {

    form.reset();
    form.dataset.id = id;
    form.dataset.mode = mode;
    form.dataset.submitting = 'false';
    form.querySelector('button[type="submit"]').disabled = false;
}

export const toggleErrorMessages = (form, errors) => {

    Object.entries(errors).forEach(([field, message]) => {

        const input = form.querySelector(`[name='${ field }']`);
        const feedback = form.querySelector(`[data-error-for='${ field }']`);

        if (!input || !feedback) return;

        feedback.classList.toggle('d-none', !message);
        input.classList.toggle('is-invalid', !!message);

        if (message) feedback.textContent = message;
        else feedback.textContent = null;
    });
}

const setInputSelectError = (form, key, message = null) => {

    const feedback = form.querySelector(`[data-error-for='${ key }']`);

    if (!feedback) return;

    feedback.classList.toggle('d-none', !message);
    feedback.classList.toggle('d-block', !!message);

    if (message) feedback.textContent = message;
    else feedback.textContent = null;
}

export const toggleInputSelectErrors = (form, errors) => {

    form.querySelectorAll('select').forEach(input => {

        const key = input.name;
        const value = errors[key];
        
        setInputSelectError(form, key, value);

        if ($(input).hasClass('select2-hidden-accessible')) {

            $(input)
                .next('.select2-container')
                .toggleClass('is-invalid', !!value)
                .find('.select2-selection')
                .toggleClass('is-invalid', !!value);
        }

        input.classList.toggle('is-invalid', !!value);
        input.toggleAttribute('aria-invalid', !!value);
    });

    form.querySelectorAll('input[type="checkbox"]').forEach(input => {

        const key = input.name;
        const value = errors[key];

        setInputSelectError(form, key, value);

        input.classList.toggle('is-invalid', !!value);
    });
}

const setTableError = (form, key, message = null) => {

    const feedback = form.querySelector(`[data-error-for=${ key }]`);

    if (!feedback) return;

    feedback.classList.toggle('d-none', !message);

    if (message) feedback.textContent = message;
    else feedback.textContent = null;
}

export const toggleTableErrors = (form, errors) => {

    const { mode } = form.dataset;

    if (mode === MODE_EDIT_DETAIL) {

        form.querySelectorAll('#productTable .is-invalid').forEach(input => {
            input.classList.remove('is-invalid');
        });

        form.querySelectorAll('#productTable [data-error-for]').forEach(feedback => {
            feedback.textContent = '';
            feedback.classList.add('d-none');
        });

        Object.keys(errors).forEach(id => {

            const fields = errors[id];

            Object.keys(fields).forEach(field => {

                const input = form.querySelector(`[data-detail-id="${ id }"][name="${ field }"]`);
                const feedback = form.querySelector(`[data-error-for="${ field }-${ id }"]`);

                if (!input || !feedback) return;

                const message = fields[field];
                input.classList.toggle('is-invalid', !!message);
                feedback.classList.toggle('d-none', !message);

                if (message) feedback.textContent = message;
                else feedback.textContent = null;
            });
        });

    } else {

        const key = 'details';
        const value = errors[key];
        setTableError(form, key, value);
    }
}

export const normalizeFormErrors = ({ form, errors }) => {

    toggleErrorMessages(form, errors);
    toggleTableErrors(form, errors);
    toggleInputSelectErrors(form, errors);

    return errors;
}

export const clearFormErrors = (form) => {

    form.querySelectorAll('.is-invalid').forEach(input => {
        input.classList.remove('is-invalid');
        input.removeAttribute('title');
        input.removeAttribute('aria-invalid');
    });

    form.querySelectorAll('.was-validated').forEach(el => {
        el.classList.remove('was-validated');
    });

    form.querySelectorAll('[data-error-for]').forEach(feedback => {
        feedback.textContent = '';
        feedback.classList.remove('d-block');
        feedback.classList.add('d-none');
    });

    form.querySelectorAll('select').forEach(input => {

        if ($(input).hasClass('select2-hidden-accessible')) {

            $(input)
                .next('.select2-container')
                .removeClass('is-invalid')
                .find('.select2-selection')
                .removeClass('is-invalid');
        }
    });

    const tableError = form.querySelector('[data-error-for="details"]');

    if (tableError) {
        tableError.textContent = '';
        tableError.classList.add('d-none');
    }
};

const getFormFieldContainer = (form, fieldName) => {

    const field = form.elements[fieldName];

    if (!field) return null;

    return field.closest('[class*="col-"]') || field.closest('.form-outline') || field.parentElement;
};

export const toggleFormFields = ({
    form,
    fields,
    isVisible
}) => {

    fields.forEach((fieldName) => {

        const field = form.elements[fieldName];
        const container = getFormFieldContainer(form, fieldName);

        if (container) container.classList.toggle('d-none', !isVisible);
        if (field) field.disabled = !isVisible;
    });
};

export const setFormReadOnly = ({
    form,
    fields = 'all',
    isReadOnly
}) => {
    
    if (fields !== 'all') {

        fields.forEach(field => {
            const input = form.querySelector(`[name='${ field }']`);

            if (input) {
                if (isReadOnly) input.setAttribute('disabled', 'disabled');
                else input.removeAttribute('disabled');
            }
        });

        return;
    }
    
    const { mode } = form.dataset;
    const elements = form.querySelectorAll('input, select, textarea');

    elements.forEach(el => {
        if (isReadOnly) {
            el.setAttribute('disabled', 'disabled');
        } else {
            el.removeAttribute('disabled');
        }
    });

    form.querySelector('#submitBtn').classList.toggle('d-none', mode === MODE_VIEW);
};

export const toggleButtons = ({
    mode,
    status = 'Cerrada',
    showActions = true,
    withTotal = true
}) => {

    const isView = mode === 'view' || mode === 'edit-detail';
    document.querySelector('.add-product-container').classList.toggle('d-none', isView);
    document.querySelector('.total-container').classList.toggle('d-none', !withTotal);
    const approveContainer = document.querySelector('.approve-container');

    if (approveContainer) {
        
        const canApprove = !showActions || !(isView && status === 'Abierta');
        approveContainer.classList.toggle('d-none', canApprove);
    }
}

export const updateTotals = ({
    quantity = 0,
    net = 0,
    gross = 0,
    operation = 'none'
} = {}) => {

    const totalQuantityEl = document.querySelector(TOTAL_FIELDS.quantity);
    const totalNetPurchaseAmountEl = document.querySelector(TOTAL_FIELDS.net);
    const totalGrossPurchaseAmountEl = document.querySelector(TOTAL_FIELDS.gross);

    if (operation === 'none') {

        [
            TOTAL_FIELDS.quantity,
            TOTAL_FIELDS.net,
            TOTAL_FIELDS.gross
        ].forEach(selector => {

            const instance = initMdbWrapperInput({
                selector,
                value: ''
            });

            updateMdbWrapperInput(instance);
        });

        return;
    }

    let totalQuantity = Number(totalQuantityEl.value) || 0;
    let totalNetPurchaseAmount = Number(totalNetPurchaseAmountEl.value) || 0;
    let totalGrossPurchaseAmount = Number(totalGrossPurchaseAmountEl.value) || 0;

    const op = operation === 'add' ? 1 : operation === 'subtract' ? -1 : 0;

    totalQuantity += quantity * op;
    totalNetPurchaseAmount += net * op;
    totalGrossPurchaseAmount += gross * op;

    const instanceTotalQuantity = initMdbWrapperInput({
        selector: TOTAL_FIELDS.quantity,
        value: totalQuantity.toFixed(2)
    });
    const instanceTotalNetPurchaseAmount = initMdbWrapperInput({
        selector: TOTAL_FIELDS.net,
        value: totalNetPurchaseAmount.toFixed(2)
    });
    const instanceTotalGrossPurchaseAmount = initMdbWrapperInput({
        selector: TOTAL_FIELDS.gross,
        value: totalGrossPurchaseAmount.toFixed(2)
    });

    updateMdbWrapperInput(instanceTotalQuantity);
    updateMdbWrapperInput(instanceTotalNetPurchaseAmount);
    updateMdbWrapperInput(instanceTotalGrossPurchaseAmount);
}

export const clearAddedProductInput = () => {

    $('#productInput').empty().trigger('change');
    document.querySelector('#quantityInput').value = '';
    document.querySelector('#presentationDisplayInput').value = '';
    const costInput = document.querySelector('#costPerUnitInput');

    if (costInput) costInput.value = '';
}

export const toggleInvoiceInput = ({ value, mode, form }) => {

    const invoiceContainer = document.getElementById('invoiceContainer');

    if (value === 'invoice') invoiceContainer.style.display = '';
    else invoiceContainer.style.display = 'none';
}
