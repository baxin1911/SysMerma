import { getAllMovements } from "../../application/admin/movements.js";
import { exportMovementReport } from "../../application/admin/report.js";
import { getProductOptions } from "../../application/warehouse/products.js";
import { getSupplierOptions } from "../../application/warehouse/suppliers.js";
import { buildExcelButton, clearTableFilters, isClearingFilters } from "../../ui/tableUI.js";
import { on } from "../../utils/domUtils.js";
import { formatFileName } from "../../utils/formatters.js";
import { toggleDisabledElement } from "../../utils/formUtils.js";
import { bindDependency } from "../select2/baseSelect.js";
import { getMovementTypeSelectApi, getMovementTypeData, attachMovementTypeFilterHandler, initMovementTypeFilterSelect } from "../select2/domains/movementType.js";
import { attachProductFilterHandler, getProductSelectApi, initProductFilterSelect, toggleProductOption } from "../select2/domains/product.js";
import { attachSupplierFilterHandler, getSupplierSelectApi, initSupplierFilterSelect } from "../select2/domains/supplier.js";
import { createDataTable, renderActionButtons } from "./baseDatatable.js";
import { attachDateFilterHandler, setupTableFilters } from "./utils/tableFilter.js";

const selector = '#table';
let filters = {
    getValues: () => ({})
};

export const createMovementDatatable = async () => {

    const productFilterSelector = '#productFilter';
    const supplierFilterSelector = '#supplierFilter';
    const productFilterElement = document.querySelector(productFilterSelector);

    bindDependency({
        sourceSelector: supplierFilterSelector,
        onChange: ({ value }) => {

            const isDisabled = !value;

            toggleProductOption({
                selector: productFilterSelector,
                data: {
                    id: null,
                    text: null
                }
            });

            $(productFilterSelector).val(null).trigger('change');

            toggleDisabledElement({
                element: productFilterElement,
                isDisabled
            });
        }
    });

    const updateTable = () => {

        if (isClearingFilters) return;

        table.ajax.reload();
    };

    filters = await setupTableFilters({
        filters: [
            {
                customGetValues: () => ({
                    startDate: document.querySelector('#startDateInput')?.value || '',
                    endDate: document.querySelector('#endDateInput')?.value || ''
                }),
                attachHandler: () => attachDateFilterHandler({
                    onChange: updateTable
                })
            },
            {
                key: 'movementType',
                isSelected: false,
                getSelectApi: getMovementTypeSelectApi,
                getOptions: getMovementTypeData,
                initSelect: initMovementTypeFilterSelect,
                attachHandler: () => attachMovementTypeFilterHandler({
                    onChange: () => updateTable()
                })
            },
            {
                key: 'supplierId',
                isSelected: false,
                getSelectApi: getSupplierSelectApi,
                getOptions: getSupplierOptions,
                initSelect: initSupplierFilterSelect,
                attachHandler: () => attachSupplierFilterHandler({
                    onChange: () => updateTable()
                })
            },
            {
                key: 'productId',
                isSelected: false,
                getSelectApi: getProductSelectApi,
                getOptions: getProductOptions,
                initSelect: ({ selectedId }) => initProductFilterSelect({ selectedId, supplierFilterSelector }),
                attachHandler: () => attachProductFilterHandler({
                    onChange: () => updateTable()
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
                    request: () => exportMovementReport(filters.getValues())
                })
            ]
        }
    });

    on('click', '#clearFiltersButton', (e) => {
        
        clearTableFilters(table);

        e.target.blur();
    });
}