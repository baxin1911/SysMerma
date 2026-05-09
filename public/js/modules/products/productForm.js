import { useForm } from "../../application/form.js";
import { editProduct, registerProduct } from "../../application/warehouse/products.js";

import { handleSubmit, validateFields } from "../../utils/formUtils.js";
import { productValidators } from "../../utils/validations/validators.js";

const formId = '#productForm';

useForm({
    selector: formId,
    normalizeData: ({ formData }) => {

        formData.isActive = document.querySelector(`${ formId } #isActiveInput`).checked;
        
        return formData;
    },
    getErrors: ({ formData }) => validateFields(productValidators, formData),
    sendRequest: async ({ formData, form }) => {

        const product = await handleSubmit({
            form,
            formData,
            create: registerProduct,
            update: editProduct
        });

        form.onSave?.(product);
    },
});