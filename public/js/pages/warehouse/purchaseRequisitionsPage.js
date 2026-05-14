import { useForm } from "../../application/form.js";
import { cancelPurchaseRequisition, confirmPurchaseRequisition, editPurchaseRequisition, registerPurchaseRequisition } from "../../application/warehouse/purchaseRequisitions.js";
import { refreshProductTable } from "../../plugins/datatable/baseDatatable.js";
import { createPurchaseRequisitionDatatable, details, initDetailsPurchaseRequisitionTable } from "../../plugins/datatable/purchaseRequisitionDatatable.js";
import { initPurchaseRequisitionFormSelect2 } from "../../plugins/select2/modules/purchaseRequisitionSelect.js";
import { setFormReadOnly, toggleButtons, clearFormErrors, normalizeFormErrors, clearAddedProductInput } from "../../ui/formUI.js";
import { openModal } from "../../ui/modalUI.js";
import { on } from "../../utils/domUtils.js";
import { formatDateLongWithTime } from "../../utils/formatters.js";
import { handleAction, handleSubmit, hasValidationErrors, validateFields } from "../../utils/formUtils.js";
import { validatePurchaseRequisitionValidators } from "../../utils/validations/validators.js";

const context = window.meta || {};
const modalId = '#purchaseRequisitionModal';
const formId = '#purchaseRequisitionForm';
const backSelector = `#backBtn-${modalId.replace('#', '')}`;

createPurchaseRequisitionDatatable(context);

useForm({
    selector: formId,
    normalizeData: ({ formData }) => {

        formData.details = details;

        return formData;
    },
    getErrors: ({ formData }) => {

        let errors = {};

        errors = validateFields(validatePurchaseRequisitionValidators, formData);

        return errors;
    },
    sendRequest: async ({ formData, form }) => {

        await handleSubmit({
            form,
            formData,
            create: registerPurchaseRequisition,
            update: editPurchaseRequisition
        });
    },
});

export const openPurchaseRequisitionModal = async ({ mode, data = null }) => {

    const form = document.querySelector(formId);
    const modalElement = document.querySelector(modalId);

    form.dataset.mode = mode;
    form.dataset.id = data?.id || '';

    clearFormErrors(form);
    toggleButtons({ mode, status: data?.status?.name });
    setFormReadOnly({ form, isReadOnly: false });

    details.length = 0;

    if (mode === 'create') {

        form.reset();
        modalElement.querySelector('#modalTitle').textContent = 'Registrar requisición';
        form.querySelector('#submitBtn').textContent = 'Guardar';
        form.querySelector('#presentationDisplayInput').value = '';

        await initPurchaseRequisitionFormSelect2();
    }

    if (mode === 'edit' || mode === 'view') {

        form.querySelector('#observationsInput').value = data.observations || '';
        form.querySelector('#requestDateInput').value = formatDateLongWithTime(data.requestDate);
        details.push(...data?.details.map(detail => ({
            id: detail.id,
            name: detail.product.name,
            productId: detail.product.id,
            quantity: detail.quantity,
            description: detail.description,
            uom: detail.product.presentation || 'PIEZA'
        })));

        await initPurchaseRequisitionFormSelect2(data);

        if (mode === 'edit') {

            modalElement.querySelector('#modalTitle').textContent = 'Editar requisición';
            form.querySelector('#submitBtn').textContent = 'Actualizar';
        }

        if (mode === 'view') {

            modalElement.querySelector('#modalTitle').textContent = 'Ver requisición';

            setFormReadOnly({ form, isReadOnly: true });
        }
    }

    initDetailsPurchaseRequisitionTable(mode);

    openModal(modalElement);
};

const addProduct = () => {

    const option = document.querySelector('#productInput option:checked');

    const { productName, presentation } = option?.dataset;
    const productId = option.value;
    const quantity = document.querySelector('#quantityInput').value;

    const errors = validateFields(validateAddProductValidators, {
        productId,
        quantity
    });

    normalizeFormErrors({ form: document.querySelector(formId), errors });

    if (hasValidationErrors(errors)) return;

    if (!option) return null;

    const product = { productId, name: productName, quantity, presentation };
    details.push(product);

    refreshProductTable(details);

    clearAddedProductInput();
};

on('click', '#addProductBtn', addProduct);
on('click', '#cancelBtn', async ()=> await handleAction({ action: cancelPurchaseRequisition, formId }));
on('click', '#confirmBtn', async () => await handleAction({ action: confirmPurchaseRequisition, formId }));