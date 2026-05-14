import { handleApiError } from "../api/errorHandler.js";
import { toggleErrorMessages, normalizeFormErrors } from "../ui/formUI.js";
import { on } from "../utils/domUtils.js";
import { hasValidationErrors } from "../utils/formUtils.js";

export const useForm = async ({ 
    selector,
    normalizeData = () => {},
    normalizeErrors = normalizeFormErrors,
    getErrors = () => {},
    sendRequest,
    normalizeServerErrors = normalizeFormErrors,
}) => {

    on('submit', selector, async (e, form) => {

        e.preventDefault();

        let formData = Object.fromEntries(new FormData(form));

        formData = normalizeData({ form, formData });

        const errors = getErrors({ form, formData });

        normalizeErrors({ form, errors });
        toggleErrorMessages(form, errors);

        if (hasValidationErrors(errors)) return;

        try {

            await sendRequest({ formData, form });

        } catch (err) {

            handleApiError({
                err,
                form,
                normalizeServerErrors
            });
        }
    });
}