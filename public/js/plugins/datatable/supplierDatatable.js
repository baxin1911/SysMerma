import { getAllSuppliers } from "../../application/warehouse/suppliers.js";
import { openSupplierModal } from "../../modules/suppliers/supplierModal.js";
import { createDataTable, renderActionButtons } from "./baseDatatable.js";
import { getResponsiveRowData } from "./utils/responsive.js";

const selector = '#table';

export const createSupplierDatatable = () => {

    const table = createDataTable({
        options: {
            ajax: {
                get: getAllSuppliers
            },
            columns: [
                { data: 'tradeName', title: 'Nombre comercial' },
                { data: 'legalName', title: 'Razón social' },
                {
                    data: null,
                    title: 'Acciones',
                    render: () => renderActionButtons({ context: 'supplier' })
                }
            ],
            buttons: [
                {
                    text: 'Nuevo proveedor',
                    action: () => openSupplierModal({ mode: 'create' })
                }
            ]
        }
    });

    $(`${ selector } tbody`).on('click', '.btn-edit', function () {

        const data = getResponsiveRowData(table, this);

        openSupplierModal({ mode: 'edit', data });
    });
}