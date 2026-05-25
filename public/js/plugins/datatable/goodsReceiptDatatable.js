import { openGoodsReceiptModal } from "../../pages/warehouse/goodsReceiptsPage.js";
import { createDataTable, renderActionButtons } from "./baseDatatable.js";
import { getAllGoodsReceipts } from "../../application/warehouse/goodsReceipts.js";
import { initMdbWrapperInput, updateMdbWrapperInput } from "../mdb/baseInstance.js";
import { buildDetailsColumns, buildDetailsHeader } from "./utils/builderDetailDatatable.js";
import { handleDelete, renderMaterialName } from "./utils/renderProductDatatable.js";
import { getResponsiveRowData } from "./utils/responsive.js";

export let details = [];
const selectorProductTable = '#productTable';
const selectorTable = '#table';
const table = document.querySelector(selectorProductTable);
table.innerHTML = `
    <thead>
        <tr>
            <th rowspan="2">Material</th>
            <th colspan="2">Medidas</th>
            <th rowspan="2">Compra</th>
            <th rowspan="2">Presentación</th>
            <th colspan="2">Conversión</th>
            <th rowspan="2">Costo Unitario de Conversión</th>
            <th rowspan="2">Costo por Presentación</th>
            <th rowspan="2">Monto s/ IVA</th>
            <th rowspan="2">Monto c/ IVA</th>
            <th rowspan="2">Acciones</th>
        </tr>
        <tr>
            <th>Base</th>
            <th>Altura</th>
            <th>Cantidad</th>
            <th>Unidad</th>
        </tr>
    </thead>
`;

export const createGoodsReceiptDatatable = () => {
    
    const table = createDataTable({
        options: {
            ajax: {
                get: getAllGoodsReceipts
            },
            columns: [
                { data: 'referenceNumber', title: 'Folio' },
                { 
                    data: null,
                    title: 'Recepción',
                    render: (data, type, row) => {

                        const name = row.receivedByName;
                        const date = new Date(row.receptionDate).toLocaleString();

                        return `<div>${ name }<br><small>${ date }</small></div>`;
                    }
                },
                { data: 'supplierName', title: 'Proveedor' },
                {
                    data: 'id',
                    title: 'Acciones',
                    render: (_, __, row) => renderActionButtons({ status: row.status?.name, context: 'goodsReceipt' })
                }
            ],
            buttons: [
                {
                    text: 'Nueva compra',
                    action: () => openGoodsReceiptModal({ mode: 'create' })
                }
            ]
        }
    });

    $(`${ selectorTable } tbody`).on('click', '.btn-view', function() {

        const data = getResponsiveRowData(table, this);

        openGoodsReceiptModal({ mode: 'view', data });
    });
}

export const initDetailsGoodsReceiptTable = (mode) => {

    const table = document.querySelector(selectorProductTable);

    if ($.fn.DataTable.isDataTable(selectorProductTable)) {
        $(selectorProductTable).DataTable().clear().destroy();
        $(selectorProductTable).empty();
    }

    table.innerHTML = buildDetailsHeader({
        type: 'receipt',
        mode
    });

    const columns = buildDetailsColumns({
        type: 'receipt',
        mode,
        render: (_, __, row) => {

            const modal = document.querySelector('#goodsReceiptModal');
            const select = modal?.querySelector('.supplier-select');
            const supplier = select?.options[select.selectedIndex]?.text || '';
            
            return renderMaterialName(row, supplier);
        }
    });

    createDataTable({
        selector: selectorProductTable,
        options: { data: details, columns }
    });
};

$(selectorProductTable).on('click', '.delete-btn', function () {

    const id = $(this).data('id');
    
    handleDelete({
        id,
        details,
        context: 'receipt'
    })
});
