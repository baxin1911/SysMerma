import xlsx from 'xlsx';
import { findMovementReportRows } from "../../../services/inventory/reportService.js";

const SHEET_NAME = 'Movimientos';
const FILENAME = 'informe_movimientos';

const getReportFilename = () => {

    const now = new Date();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const year = now.getUTCFullYear();

    return `${FILENAME}_${year}-${month}`;
};

export const exportMovementReport = async (req, res) => {

    const rows = await findMovementReportRows();

    const data = [
        [
            'Fecha',
            'Tipo',
            'Folio',
            'Material',
            'Proveedor',
            'Stock Anterior',
            'Movimiento',
            'Stock Nuevo',
            'Cantidad Convertida Anterior',
            'Cantidad Convertida',
            'Cantidad Convertida Nueva'
        ],

        ...rows.map(row => [
            row.date,
            row.type === 'ENTRY' ? 'Entrada' : row.type === 'ISSUE' ? 'Salida' : row.type === 'ADJUSTMENT' ? 'Ajuste' : row.type,
            row.referenceNumber,
            row.productName,
            row.supplierName,
            row.previousStock,
            row.quantity,
            row.newStock,
            row.previousConvertedQuantity,
            row.convertedQuantity,
            row.newConvertedQuantity
        ])
    ];

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.aoa_to_sheet(data);

    xlsx.utils.book_append_sheet(workbook, worksheet, SHEET_NAME);

    const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${ getReportFilename() }.xlsx"`);
    return res.send(excelBuffer);
}