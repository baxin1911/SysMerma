import { openPurchaseRequisitionModal } from "../../pages/warehouse/purchaseRequisitionsPage.js";
import { createDataTable, refreshProductTable, renderActionButtons } from "./baseDatatable.js";
import { PURCHASE_REQUISITIONS_API_ROUTE } from "../../services/warehouse/purchaseRequisitionService.js";
import { hasPermission } from "../../utils/permissions.js";
import { getResponsiveRowData } from "./utils/responsive.js";

export let details = [];
const selectorProductTable = '#productTable';
const selectorTable = '#table';

export const createPurchaseRequisitionDatatable = (context) => {

    const { isWarehouse, isSystem } = hasPermission(context);
    const columns = [
        { data: 'referenceNumber', title: 'Folio' },
        {
            data: null,
            title: 'Solicitud',
            render: (data, type, row) => {

                const name = `${ row.requester.name } ${ row.requester.lastName }`;
                const date = new Date(row.requestDate).toLocaleString();

                return `<div>${ name }<br><small>${ date }</small></div>`;
            }
        }
    ];

    if (isWarehouse || isSystem) {
        columns.push({
            data: 'department.name',
            title: 'Área'
        });
    }

    columns.push(
        {
            data: null,
            title: 'Proyecto',
            render: (data, type, row) => {

                const projectDate = new Date(row.project.date).toLocaleDateString();
                return `<div>${ row.project.referenceNumber } - ${ row.project.name }<br><small>${ row.project.client } | ${ projectDate }</small></div>`;
            }
        },
        {
            data: null,
            title: 'Aprobación',
            render: (data, type, row) => {

                if (!row.approverId || !row.approveDate) return '<small>Sin autorizar</small>';

                const approver = `${ row.approver.name } ${ row.approver.lastName }`;
                const approveDate = new Date(row.approveDate).toLocaleString();

                return `<div>${ approver }<br><small>${ approveDate }</small></div>`;
            }
        },
        { data: 'status.name', title: 'Estado' },
        {
            data: 'id',
            title: 'Acciones',
            render: (data, type, row) => renderActionButtons(row.status?.name)
        }
    );

    const table = createDataTable({
        options: {
            ajax: {
                url: PURCHASE_REQUISITIONS_API_ROUTE,
                data: (d) => {
                    d.department = context.department || '';
                }
            },
            columns,
            buttons: [
                {
                    text: 'Nueva requisición',
                    action: () => {
                        openPurchaseRequisitionModal({ mode: 'create' });
                    }
                }
            ]
        }
    });

    $(`${ selectorTable } tbody`).on('click', '.btn-edit', async function() {

        const data = getResponsiveRowData(table, this);

        await openPurchaseRequisitionModal({ mode: 'edit', data });
    });

    $(`${ selectorTable } tbody`).on('click', '.btn-view', function() {

        const data = getResponsiveRowData(table, this);

        openPurchaseRequisitionModal({ mode: 'view', data });
    });
};

export const initDetailsPurchaseRequisitionTable = (mode) => {

    if ($.fn.DataTable.isDataTable(selectorProductTable)) {
        $(selectorProductTable).DataTable().clear().destroy();
        $(selectorProductTable).empty();
    }

    const columns = [
        { data: 'name', title: 'Producto' },
        { data: 'quantity', title: 'Cantidad' },
        { 
            data: 'presentation', 
            title: 'Presentación',
            render: (data) => `PIEZA (${ data })`
        },
    ];

    if (mode !== 'view') {
        columns.push({
            title: 'Acciones',
            data: null,
            render: (data, type, row, meta) => {
                return `
                    <button class="btn btn-danger btn-sm delete-btn" data-index="${ meta.row }">
                        Eliminar
                    </button>
                `;
            }
        });
    }

    createDataTable({
        selector: selectorProductTable,
        options: {
            data: details,
            columns
        }
    });
};

$(selectorProductTable).on('click', '.delete-btn', function() {

    const index = $(this).data('index');

    details.splice(index, 1);

    refreshProductTable(details);
});