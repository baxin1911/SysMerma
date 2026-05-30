import { getAllMovements } from "../../application/admin/movements.js";
import { exportMovementReport } from "../../application/admin/report.js";
import { getProductOptions } from "../../application/warehouse/products.js";
import { getSupplierOptions } from "../../application/warehouse/suppliers.js";
import { buildExcelButton } from "../../ui/excelUI.js";
import { formatFileName } from "../../utils/formatters.js";
import { getMovementTypeSelectApi, getMovementTypeData, attachMovementTypeFilterHandler, initMovementTypeFilterSelect } from "../select2/domains/movementType.js";
import { attachProductFilterHandler, getProductSelectApi, initProductFilterSelect } from "../select2/domains/product.js";
import { attachSupplierFilterHandler, getSupplierSelectApi, initSupplierFilterSelect } from "../select2/domains/supplier.js";
import { createDataTable, renderActionButtons } from "./baseDatatable.js";
import { attachDateFilterHandler, setupTableFilters } from "./utils/tableFilter.js";

const selector = '#table';
let filters = {
    getValues: () => ({})
};

export const createMovementDatatable = async () => {

    filters = await setupTableFilters({
        filters: [
            {
                customGetValues: () => ({
                    startDate: document.querySelector('#startDateInput')?.value || '',
                    endDate: document.querySelector('#endDateInput')?.value || ''
                }),
                attachHandler: () => attachDateFilterHandler({
                    onChange: () => table.ajax.reload()
                })
            },
            {
                key: 'movementType',
                getSelectApi: getMovementTypeSelectApi,
                getOptions: getMovementTypeData,
                initSelect: initMovementTypeFilterSelect,
                attachHandler: () => attachMovementTypeFilterHandler({
                    onChange: () => table.ajax.reload()
                })
            },
            {
                key: 'productId',
                isSelected: false,
                getSelectApi: getProductSelectApi,
                getOptions: getProductOptions,
                initSelect: initProductFilterSelect,
                attachHandler: () => attachProductFilterHandler({
                    onChange: () => table.ajax.reload()
                })
            },
            {
                key: 'supplierId',
                isSelected: false,
                getSelectApi: getSupplierSelectApi,
                getOptions: getSupplierOptions,
                initSelect: initSupplierFilterSelect,
                attachHandler: () => attachSupplierFilterHandler({
                    onChange: () => table.ajax.reload()
                })
            }
        ]
    });

    const table = createDataTable({
        options: {
            ajax: {
                get: (params) => getAllMovements({
                    ...params,
                    ...filters.getValues()
                })
            },
            columns: [
                { data: 'date', title: 'Fecha' },
                { 
                    data: 'type', 
                    title: 'Tipo', 
                    render: (data) => {

                        if (data === 'ENTRY') return 'Entrada';

                        if (data === 'ADJUSTMENT') return 'Ajuste';
                        
                        if (data === 'ISSUE') return 'Salida';

                        return data;
                    }
                },
                { data: 'referenceNumber', title: 'Folio' },
                { data: 'productName', title: 'Material' },
                { data: 'productBase', title: 'Base' },
                { data: 'productHeight', title: 'Altura' },
                { data: 'supplierName', title: 'Proveedor' },
                { data: 'previousStock', title: 'Stock Anterior' },
                { data: 'quantity', title: 'Movimiento' },
                { data: 'newStock', title: 'Stock Nuevo' },
                { data: 'previousConvertedQuantity', title: 'Cantidad Convertida Anterior' },
                { data: 'convertedQuantity', title: 'Cantidad Convertida' },
                { data: 'newConvertedQuantity', title: 'Cantidad Convertida Nueva' },
            ],
            buttons: [
                buildExcelButton({
                    filename: formatFileName('reporte_movimientos'),
                    request: exportMovementReport
                })
            ]
        }
    });
}