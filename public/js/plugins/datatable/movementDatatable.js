import { getAllMovements } from "../../application/admin/movements.js";
import { exportMovementReport } from "../../application/admin/report.js";
import { buildExcelButton } from "../../ui/excelUI.js";
import { formatFileName } from "../../utils/formatters.js";
import { createDataTable, renderActionButtons } from "./baseDatatable.js";

const selector = '#table';

export const createMovementDatatable = () => {

    const table = createDataTable({
        options: {
            ajax: {
                get: (params) => getAllMovements({
                    ...params,
                })
            },
            columns: [
                { data: 'date', title: 'Fecha' },
                { 
                    data: 'type', 
                    title: 'Tipo', 
                    render: (data) => {

                        if (data === 'IN') return 'Entrada';

                        if (data === 'ADJUSTMENT') return 'Ajuste';
                        
                        if (data === 'OUT') return 'Salida';

                        return data;
                    }
                },
                { data: 'referenceNumber', title: 'Folio' },
                { data: 'productName', title: 'Material' },
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