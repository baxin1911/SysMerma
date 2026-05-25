import { createDataTable, renderActionButtons } from "./baseDatatable.js";
import { notifications } from "../swal/swalComponent.js";
import { hasPermission } from "../../utils/permissions.js";
import { renderMaterialName } from "./utils/renderProductDatatable.js";
import { getAllWastes } from "../../application/warehouse/wastes.js";
import { openWasteModal } from "../../pages/warehouse/wastesPage.js";
import { getResponsiveRowData } from "./utils/responsive.js";

const selectorTable = '#table';
let lastLowStockNotification = '';
let stockSocketConfigured = false;

const table = document.querySelector(selectorTable);
table.innerHTML = `
    <thead>
        <tr>
            <th rowspan="2">Material</th>
            <th colspan="2">Medidas</th>
            <th rowspan="2">Compra</th>
            <th rowspan="2">Stock Mínimo</th>
            <th rowspan="2">Presentación</th>
            <th colspan="2">Conversión</th>
            <th rowspan="2">Costo Unitario</th>
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

export const createWasteDatatable = (context) => {

    const { isWarehouse, isSystem, isSales } = hasPermission(context);

    const columns = [
        { 
            data: null, 
            title: 'Material',
            render: (data, type, row) => renderMaterialName(row)
        },
        { data: 'base', title: 'Base' },
        { data: 'height', title: 'Altura' },
        { data: 'currentStock', title: 'Existencia' },
        { data: 'minStock', title: 'Stock Mínimo' },
        { data: 'presentation.name', title: 'Presentación' },
        { data: 'convertedQuantity', title: 'Cantidad' },
        { data: 'unitMeasure.name', title: 'Unidad' }
    ];

    if (isWarehouse || isSystem || isSales) {
        columns.push({ data: 'maxUnitCost', title: 'Costo Unitario de Conversión' });
    }

    if (isWarehouse || isSystem) {
        columns.push({
            data: null,
            title: 'Acciones',
            render: () => renderActionButtons({ status: 'Abierta', context: 'product' })
        });
    }

    const table = createDataTable({
        options: {
            ajax: {
                get: getAllWastes
            },
            columns,
            buttons: [
                {
                    text: 'Nueva merma',
                    action: () => openWasteModal({ mode: 'create' })
                }
            ]
        }
    });

    $(`${ selectorTable } tbody`).on('click', '.btn-edit', async function() {

        const data = getResponsiveRowData(table, this);

        await openWasteModal({ mode: 'edit', data });
    });
}
