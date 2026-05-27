import { getAllClients } from "../../application/sales/clients.js";
import { openClientModal } from "../../modules/clients/clientModal.js";
import { createDataTable, renderActionButtons } from "./baseDatatable.js";
import { getResponsiveRowData } from "./utils/responsive.js";

const selector = '#table';

export const createClientDatatable = () => {

    const table = createDataTable({
        options: {
            ajax: {
                get: getAllClients
            },
            columns: [
                { data: 'name', title: 'Nombre' },
                {
                    data: null,
                    title: 'Acciones',
                    render: () => renderActionButtons({ context: 'client' })
                }
            ],
            buttons: [
                {
                    text: 'Nuevo cliente',
                    action: () => openClientModal({ mode: 'create' })
                }
            ]
        }
    });

    $(`${ selector } tbody`).on('click', '.btn-edit', function () {

        const data = getResponsiveRowData(table, this);

        openClientModal({ mode: 'edit', data });
    });
}