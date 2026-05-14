import { getErrorMessage } from "../constants/apiMessages.js";
import { notifications } from "../plugins/swal/swalComponent.js";
import { clearFormErrors, normalizeFormErrors } from "../ui/formUI.js";
import { mapServerErrors } from "../utils/formUtils.js";

const getFallbackMessage = (err) => err?.message || 'Ocurrió un error inesperado.';

export const normalizeJqAjaxError = (jqXHR, errorThrown = null) => {

    const data = jqXHR?.responseJSON ?? null;
    const message = getErrorMessage(data) || errorThrown || jqXHR?.statusText || 'No fue posible conectar con el servidor.';

    return {
        status: jqXHR?.status ?? 0,
        data,
        message,
        raw: jqXHR
    };
};

export const handleApiError = ({
    err,
    form = null,
    normalizeServerErrors = normalizeFormErrors,
    rethrow = true
}) => {

    const { status, data, message } = err;

    switch (status) {

        case 400: {
            const serverErrors = mapServerErrors(data?.errors ?? data);

            if (form && serverErrors && typeof serverErrors === 'object') {
                clearFormErrors(form);
                normalizeServerErrors({ form, errors: serverErrors });
                return;
            }

            notifications.showError(message || 'Errores de validación.');
            return;
        }

        case 401:
            localStorage.setItem('showErrorToast', getFallbackMessage(err));
            window.location.replace('/');
            return;

        case 404:
        case 409:
            notifications.showError(getFallbackMessage(err));
            return;

        default:
            notifications.showError(getFallbackMessage(err));
            if (rethrow) throw err;
    }
};

export const handleDataTableError = (err, table = null) => {

    const { status, message } = err;

    switch (status) {

        case 401:
            localStorage.setItem('showErrorToast', getFallbackMessage(err));
            window.location.replace('/');
            return [];

        case 404:
            notifications.showError(message || 'No se encontraron registros.');
            return [];

        default:
            notifications.showError(
                message || 'No fue posible cargar la información.'
            );

            if (table) table.clear().draw();

            return [];
    }
};