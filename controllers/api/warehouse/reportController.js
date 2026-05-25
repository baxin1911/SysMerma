import xlsx from 'xlsx';
import { findWarehouseReportRows } from "../../../services/warehouse/reportService.js";

const SHEET_NAME = 'Inventario';
const FILENAME = 'reporte_inventario_productos';

const getReportFilename = () => {

    const now = new Date();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const year = now.getUTCFullYear();

    return `${ FILENAME }_${ month }_${ year }`;
};

export const exportWarehouseReportExcel = async (req, res) => {

    const rows = await findWarehouseReportRows();

    const data = [
        [
            'Proveedor',
            'Material',
            'Base',
            'Altura',
            'Existencia',
            'Stock mínimo',
            'Presentación',
            'Conversión',
            'Unidad',
            'Costo unitario'
        ],

        ...rows.map(row => [
            row.supplier,
            row.name,
            row.base,
            row.height,
            row.currentStock,
            row.minStock,
            row.presentation,
            row.convertedQuantity,
            row.unitMeasure,
            row.maxUnitCost
        ])
    ];

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.aoa_to_sheet(data);

    xlsx.utils.book_append_sheet(workbook, worksheet, SHEET_NAME);

    const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${ getReportFilename() }.xlsx"`);
    return res.send(excelBuffer);
};
