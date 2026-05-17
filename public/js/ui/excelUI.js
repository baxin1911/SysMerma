import { downloadBlob } from "../utils/downloadBlob.js";
import { notifications } from "../plugins/swal/swalComponent.js";

export const buildExcelButton = ({
    filename = 'reporte.xlsx',
    request
} = {}) => ({
    text: 'Exportar Excel',
    action: async () => {
        if (typeof request !== 'function') {
            notifications.showError('No se pudo exportar el archivo. Inténtalo nuevamente.');
            return;
        }

        try {

            const blob = await request();
            downloadBlob({ blob, filename });

        } catch (err) {

            const message = err?.message || 'No se pudo exportar el archivo. Verifica tu conexión e inténtalo de nuevo.';
            notifications.showError(message);
        }
    }
});
