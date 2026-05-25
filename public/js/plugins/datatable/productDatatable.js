import { openProductModal } from "../../modules/products/productModal.js";
import { createDataTable, renderActionButtons } from "./baseDatatable.js";
import { notifications } from "../swal/swalComponent.js";
import { hasPermission } from "../../utils/permissions.js";
import { getAllProducts } from "../../application/warehouse/products.js";
import { renderMaterialName } from "./utils/renderProductDatatable.js";
import { getResponsiveRowData } from "./utils/responsive.js";
import { buildExcelButton } from "../../ui/excelUI.js";
import { exportWarehouseReport } from "../../application/warehouse/report.js";
import { formatInventoryFileName as formatFileName } from "../../utils/formatters.js";
import { openStockAdjustmentModal } from "../../pages/warehouse/productsPage.js";

const selectorTable = '#table';
let lastLowStockNotification = '';
let stockSocketConfigured = false;

const tableElement = document.querySelector(selectorTable);
tableElement.innerHTML = `
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

const configureStockRealtime = (table) => {

    if (stockSocketConfigured) return;

    stockSocketConfigured = true;

    window.addEventListener('stock:updated', () => {
        table.ajax.reload(null, false);
    });
};

export const createProductDatatable = (context) => {

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
                get: getAllProducts
            },
            columns,
            createdRow: (row, data) => {

                if (Number(data.currentStock) < Number(data.minStock)) {
                    row.classList.add('table-warning');
                }
            },
            drawCallback: function() {

                const currentData = this.api().rows({ page: 'current' }).data().toArray();
                const lowStockProducts = currentData.filter((product) => Number(product.currentStock) < Number(product.minStock));

                if (!lowStockProducts.length) {
                    lastLowStockNotification = '';
                    return;
                }

                const lowStockSignature = lowStockProducts.map((product) => product.id).join(',');

                if (lastLowStockNotification === lowStockSignature) return;

                lastLowStockNotification = lowStockSignature;

                const productNames = lowStockProducts
                    .slice(0, 3)
                    .map((product) => product.name)
                    .join(', ');

                notifications.showWarning(
                    `Hay ${lowStockProducts.length} producto(s) por debajo del stock mínimo: ${productNames}${lowStockProducts.length > 3 ? '...' : ''}`
                );
            },
            buttons: [
                buildExcelButton({
                    filename: formatFileName('reporte_inventario_productos'),
                    request: exportWarehouseReport
                })
            ]
        }
    });

    configureStockRealtime(table);

    $(`${ selectorTable } tbody`).on('click', '.btn-edit', function () {

        const data = getResponsiveRowData(table, this);
    
        openProductModal({ mode: 'edit', data });
    });

    $(`${ selectorTable } tbody`).on('click', '.btn-adjust-stock', function() {

        const data = getResponsiveRowData(table, this);

        openStockAdjustmentModal({ mode: 'edit-stock', data });
    });
}
