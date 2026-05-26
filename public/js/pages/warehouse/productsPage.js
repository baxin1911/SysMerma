import { useForm } from "../../application/form.js";
import { editProductStock } from "../../application/warehouse/products.js";
import { createProductDatatable } from "../../plugins/datatable/productDatatable.js";
import { initProductFormSelect2, setProductFormSelectOptions } from "../../plugins/select2/modules/productSelect.js";
import { clearFormErrors, initForm, setFormReadOnly } from "../../ui/formUI.js";
import { openModal } from "../../ui/modalUI.js";
import { handleSubmit, validateFields } from "../../utils/formUtils.js";
import { productStockValidators } from "../../utils/validations/validators.js";

const formId = '#stockAdjustmentForm';
const productModalId = '#stockAdjustmentModal';
const context = window.meta || {};

createProductDatatable(context);

useForm({
    selector: formId,
    normalizeData: ({ formData }) => {

        formData.supplierId = document.querySelector(`${ productModalId } select[name='supplierId']`).value;
        
        return formData;
    },
    getErrors: ({ formData }) => validateFields(productStockValidators, formData),
    sendRequest: async ({ formData, form }) => {

        const product = await handleSubmit({
            form,
            formData,
            update: editProductStock,
        });

        form.onSave?.(product);
    },
});

export const openStockAdjustmentModal = ({ 
    mode = 'edit-stock', 
    data = null, 
    onSave = null 
}) => {
    
    const form = document.querySelector(formId);
    const modalElement = document.querySelector(productModalId);
    const fields = ['name', 'base', 'height', 'supplierId', 'presentationId', 'unitMeasureId'];

    initForm({ form, mode, id: data?.id });
    setFormReadOnly({ form, fields, isReadOnly: true });
    clearFormErrors(form);
    initProductFormSelect2({ modalSelector: productModalId, isStockAdjustment: true });
    setProductFormSelectOptions({ 
        modalSelector: productModalId, 
        data, 
        isStockAdjustment: true 
    });

    form.elements.name.value = data.name;
    form.elements.height.value = data.height || '';
    form.elements.base.value = data.base || '';

    modalElement.querySelector('#modalTitle').textContent = 'Editar stock de producto';
    form.querySelector('#submitBtn').textContent = 'Actualizar';

    form.onSave = onSave;

    openModal(modalElement);
}