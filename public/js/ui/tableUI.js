import { downloadBlob } from "../utils/downloadBlob.js";
import { notifications } from "../plugins/swal/swalComponent.js";

export let isClearingFilters = false;


export const buildTableExportParams = (table, params = {}) => {

    const [column = 0, dir = 'asc'] = table?.order?.()?.[0] || [];

    return {
        ...params,
        search: table?.search?.() || '',
        'order[0][column]': column,
        'order[0][dir]': dir
    };
};

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

export const clearTableFilters = (table) => {

    isClearingFilters = true;

    const filterElements = document.querySelectorAll(
        '.table-filters select, .table-filters input'
    );

    filterElements.forEach(element => {
        if (element.classList.contains('select2-hidden-accessible')) {
            $(element).val(null).trigger('change');
        } else {
            element.value = '';
            element.dispatchEvent(new Event('change'));
        }
    });

    isClearingFilters = false;

    table.ajax.reload();
}