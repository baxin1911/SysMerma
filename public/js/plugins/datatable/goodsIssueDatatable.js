import { openGoodsIssueModal } from "../../pages/warehouse/goodsIssuesPage.js";
import { getAllGoodsIssues } from "../../application/warehouse/goodsIssues/goodsIssues.js";
import { exportGoodsIssueReport } from "../../application/warehouse/report.js";
import { hasPermission } from "../../utils/permissions.js";
import { buildExcelButton, buildTableExportParams } from "../../ui/tableUI.js";
import { formatFileName } from "../../utils/formatters.js";
import { createDataTable, refreshProductTable, renderActionButtons } from "./baseDatatable.js";
import { buildDetailsColumns, buildDetailsHeader } from "./utils/builderDetailDatatable.js";
import { handleDelete, renderMaterialName } from "./utils/renderProductDatatable.js";
import { getResponsiveRowData } from "./utils/responsive.js";
import { setupTableFilters } from "./utils/tableFilter.js";
import { attachFulfillmentStatusFilterHandler, getFulfillmentStatusSelectApi, initFulfillmentStatusFilterSelect } from "../select2/domains/fulfillmentStatus.js";
import { getFulfillmentStatusOptions } from "../../application/warehouse/fulfillmentStatuses.js";

export let details = [];
const selectorProductTable = '#productTable';
const tableSelector = '#table';
let filters = {
    getValues: () => ({})
};

let productTable;

export const createGoodsIssueDatatable = async (context) => {

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

    filters = await setupTableFilters({
        filters: [
            {
                key: 'fulfillmentStatusId',
                getSelectApi: getFulfillmentStatusSelectApi,
                getOptions: getFulfillmentStatusOptions,
                initSelect: initFulfillmentStatusFilterSelect,
                attachHandler: () => attachFulfillmentStatusFilterHandler({
                    onChange: () => table.ajax.reload()
                })
            }
        ]
    });

    const table = createDataTable({
        options: {
            ajax: {
                get: (params) => getAllGoodsIssues({
                    ...params,
                    ...filters.getValues()
                })
            },
            columns,
            buttons: [
                {
                    text: 'Nueva salida',
                    action: () => openGoodsIssueModal({ mode: 'create' })
                },
                buildExcelButton({
                    filename: formatFileName('reporte_salidas'),
                    request: () => exportGoodsIssueReport(buildTableExportParams(table, filters.getValues()))
                })
            ]
        }
    });

    $(`${ tableSelector } tbody`).on('click', '.btn-edit', function () {

        const data = getResponsiveRowData(table, this);

        openGoodsIssueModal({ mode: 'edit', data });
    })

    $(`${ tableSelector } tbody`).on('click', '.btn-edit-detail', function() {

        const data = getResponsiveRowData(table, this);

        openGoodsIssueModal({ mode: 'edit-detail', data });
    });

    $(`${ tableSelector } tbody`).on('click', '.btn-view', function() {

        const data = getResponsiveRowData(table, this);

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
