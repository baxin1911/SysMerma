import { openGoodsIssueModal } from "../../pages/warehouse/goodsIssuesPage.js";
import { getAllGoodsIssuesRequest } from "../../services/warehouse/goodsIssueService.js";
import { hasPermission } from "../../utils/permissions.js";
import { createDataTable, refreshProductTable, renderActionButtons } from "./baseDatatable.js";
import { buildDetailsColumns, buildDetailsHeader } from "./utils/builderDetailDatatable.js";
import { handleDelete, renderMaterialName } from "./utils/renderProductDatatable.js";

export let details = [];
const selectorProductTable = '#productTable';
const selectorTable = '#table';
let productTable;

export const createGoodsIssueDatatable = (context) => {

    const { isWarehouse, isSystem } = hasPermission(context);

    const columns = [
        { data: 'referenceNumber', title: 'Folio' },
        {
            data: null,
            title: 'Solicitud',
            render: (data, type, row) => {

                const name = row.requesterName;
                const date = new Date(row.requestDate).toLocaleString();

                return `<div>${ name }<br><small>${ date }</small></div>`;
            }
        }
    ];

    if (isWarehouse || isSystem) {
        columns.push({
            data: 'departmentName',
            title: 'Área'
        });
    }

    columns.push(
        { data: 'projectNumber', title: 'Proyecto' },
        { data: 'clientName', title: 'Cliente' },
        { data: 'fulfillmentStatus.name', title: 'Estado surtido' },
        {
            data: 'id',
            title: 'Acciones',
            render: (data, type, row) => renderActionButtons({ 
                status: row.status?.name, 
                fulfillmentStatus: row.fulfillmentStatus?.name,
                context: 'goodsIssue' 
            })
        }
    );

    const table = createDataTable({
        options: {
            ajax: {
                get: getAllGoodsIssuesRequest
            },
            columns,
            buttons: [
                {
                    text: 'Nueva salida',
                    action: () => openGoodsIssueModal({ mode: 'create' })
                }
            ]
        }
    });

    $(`${ selectorTable } tbody`).on('click', '.btn-edit', function () {

        const data = table.row($(this).closest('tr')).data();

        openGoodsIssueModal({ mode: 'edit', data });
    })

    $(`${ selectorTable } tbody`).on('click', '.btn-edit-detail', function() {

        const data = table.row($(this).closest('tr')).data();

        openGoodsIssueModal({ mode: 'edit-detail', data });
    });

    $(`${ selectorTable } tbody`).on('click', '.btn-view', function() {

        const data = table.row($(this).closest('tr')).data();

        openGoodsIssueModal({ mode: 'view', data });
    });
};

export const initDetailsGoodsIssueTable = (mode, context) => {

    const { isWarehouse, isSystem, hasRole } = hasPermission(context);

    if ($.fn.DataTable.isDataTable(selectorProductTable)) {
        $(selectorProductTable).DataTable().clear().destroy();
        $(selectorProductTable).empty();
    }

    const table = document.querySelector(selectorProductTable);

    table.innerHTML = buildDetailsHeader({
        type: 'issue',
        mode,
        isWarehouse,
        isCoordinator: hasRole('Coordinador'),
        isSystem
    });

    const columns = buildDetailsColumns({
        type: 'issue',
        mode,
        render: (_, __, row) => renderMaterialName(row),
        isWarehouse,
        isCoordinator: hasRole('Coordinador'),
        isSystem
    });

    productTable = createDataTable({
        selector: selectorProductTable,
        options: { data: details, columns }
    });
};

$(selectorProductTable).on('click', '.delete-btn', function () {

    const id = $(this).data('id');

    handleDelete({
        id,
        details,
        context: 'issue'
    })
});
