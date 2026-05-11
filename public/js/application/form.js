import { notifications } from "../plugins/swal/swalComponent.js";
import { toggleErrorMessages, normalizeFormErrors, clearFormErrors } from "../ui/formUI.js";
import { on } from "../utils/domUtils.js";
import { hasValidationErrors, mapServerErrors } from "../utils/formUtils.js";

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

            const { status, data, message } = err;

            switch (status) {

                case 400:
                    const serverErrors = mapServerErrors(data?.errors ?? data);
                    clearFormErrors(form);
                    normalizeServerErrors({ form, errors: serverErrors });
                    toggleErrorMessages(form, serverErrors);
                    return;

                case 401:
                    localStorage.setItem('showErrorToast', message);
                    window.location.replace('/');
                    return;

                case 404:
                case 409:
                    notifications.showError(message);
                    return;

                default:
                    notifications.showError(message);
                    throw err;
            }
        }
    });
}
