import { useForm } from "../../application/form.js";
import { editProduct, editProductStock, registerProduct } from "../../application/warehouse/products.js";

import { handleSubmit, validateFields } from "../../utils/formUtils.js";
import { productInitialStockValidators, productStockValidators, productValidators } from "../../utils/validations/validators.js";

const formId = '#productForm';
const productModalId = '#productModal';
const stockMode = 'edit-stock';
const createMode = 'create';

const isStockMode = (form) => form.dataset.mode === stockMode;
const canAdjustStock = (form) => form.dataset.canAdjustStock === 'true';
const hasInitialStockFields = (form, formData) => form.dataset.mode === createMode && canAdjustStock(form) && formData.newStock !== undefined && formData.newStock !== '';

useForm({
    selector: formId,
    normalizeData: ({ form, formData }) => {

        if (isStockMode(form)) {
            formData.supplierId = document.querySelector(`${ productModalId } select[name='supplierId']`).value;

            return formData;
        }

        if (!canAdjustStock(form)) {
            delete formData.newStock;
            delete formData.reasonId;
            delete formData.observations;
        }

        formData.isActive = document.querySelector(`${ formId } #isActiveInput`).checked;
        
        return formData;
    },
    getErrors: ({ form, formData }) => {

        if (isStockMode(form)) return validateFields(productStockValidators, formData);

        return {
            ...validateFields(productValidators, formData),
            ...hasInitialStockFields(form, formData) ? validateFields(productInitialStockValidators, formData) : {}
        };
    },
    sendRequest: async ({ formData, form }) => {

        const product = await handleSubmit({
            form,
            formData,
            create: registerProduct,
            update: isStockMode(form) ? editProductStock : editProduct
        });

        form.onSave?.(product);
    },
});
