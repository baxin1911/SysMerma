import { useForm } from "../../application/form.js";
import { registerClient } from "../../application/sales/clients.js";
import { handleSubmit, validateFields } from "../../utils/formUtils";
import { validateClientValidators } from "../../utils/validations/validators.js";

const formId = '#clientForm';

useForm({
    selector: formId,
    normalizeData: ({ formData }) => formData,
    getErrors: ({ formData }) => validateFields(validateClientValidators, formData),
    sendRequest: async ({ formData, form }) => {

        const client = await handleSubmit({
            form,
            formData,
            create: registerClient
        });

        form.onSave?.(client);
    }
});