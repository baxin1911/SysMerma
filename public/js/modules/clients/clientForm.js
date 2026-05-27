import { useForm } from "../../application/form.js";
import { editClient, registerClient } from "../../application/sales/clients.js";
import { handleSubmit, validateFields } from "../../utils/formUtils.js";
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
            create: registerClient,
            update: editClient
        });

        form.onSave?.(client);
    }
});