import xlsx from 'xlsx';
import { findGoodsIssueReportRows, findGoodsReceiptReportRows, findWarehouseReportRows } from "../../../services/warehouse/reportService.js";
import { getDataTableOrder, getDataTableSearch } from "../../../utils/requestQueryUtils.js";

const SHEET_NAME = 'Inventario';
const FILENAME = 'reporte_inventario_productos';
const GOODS_ISSUE_SHEET_NAME = 'Salidas';
const GOODS_ISSUE_FILENAME = 'reporte_salidas';
const GOODS_RECEIPT_SHEET_NAME = 'Compras';
const GOODS_RECEIPT_FILENAME = 'reporte_compras';

const getReportFilename = (filename = FILENAME) => {

    const now = new Date();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const year = now.getUTCFullYear();

    return `${ filename }_${ month }_${ year }`;
};

const sendExcelResponse = ({ res, data, sheetName, filename }) => {

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.aoa_to_sheet(data);

    xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);

    const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${ getReportFilename(filename) }.xlsx"`);
    return res.send(excelBuffer);
};

export const exportWarehouseReportExcel = async (req, res) => {

    const columns = ['name', 'base', 'height', null, 'minStock', null, null, null, null, null];
    const { orderBy, orderDir } = getDataTableOrder({
        query: req.query,
        columns
    });

    const rows = await findWarehouseReportRows({
        search: getDataTableSearch(req.query),
        orderBy,
        orderDir
    });

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

    return sendExcelResponse({
        res,
        data,
        sheetName: SHEET_NAME,
        filename: FILENAME
    });
};

export const exportGoodsIssueReportExcel = async (req, res) => {

    const columns = ['referenceNumber', 'requestDate', 'departmentName', 'projectNumber', 'clientName', null, null];
    const { orderBy, orderDir } = getDataTableOrder({
        query: req.query,
        columns,
        defaultDirection: 'desc'
    });

    const rows = await findGoodsIssueReportRows({
        search: getDataTableSearch(req.query),
        fulfillmentStatusId: req.query.fulfillmentStatusId || '',
        accesses: req.user?.accesses || [],
        orderBy,
        orderDir
    });

    const data = [
        [
            'Folio',
            'Fecha de solicitud',
            'Área',
            'Solicitante',
            'Cliente',
            'Proyecto',
            'Estado de surtido',
            'Material',
            'Proveedor',
            'Base',
            'Altura',
            'Cantidad solicitada',
            'Presentación',
            'Cantidad convertida',
            'Unidad de conversión',
            'Cantidad surtida',
            'Unidad surtida',
            'Estado del detalle'
        ],

        ...rows.map(row => [
            row.referenceNumber,
            row.requestDate,
            row.departmentName,
            row.requesterName,
            row.clientName,
            row.projectNumber,
            row.fulfillmentStatusName,
            row.productName,
            row.supplierName,
            row.productBase,
            row.productHeight,
            row.requestedQuantity,
            row.presentationName,
            row.convertedQuantity,
            row.convertedUnitMeasureName,
            row.suppliedQuantity,
            row.suppliedUnitMeasureName,
            row.detailFulfillmentStatusName
        ])
    ];

    return sendExcelResponse({
        res,
        data,
        sheetName: GOODS_ISSUE_SHEET_NAME,
        filename: GOODS_ISSUE_FILENAME
    });
};

export const exportGoodsReceiptReportExcel = async (req, res) => {

    const columns = ['referenceNumber', 'receptionDate', 'supplierName', 'invoice', null];
    const { orderBy, orderDir } = getDataTableOrder({
        query: req.query,
        columns,
        defaultDirection: 'desc'
    });

    const rows = await findGoodsReceiptReportRows({
        search: getDataTableSearch(req.query),
        orderBy,
        orderDir
    });

    const data = [
        [
            'Folio',
            'Fecha de recepción',
            'Recibió',
            'Proveedor',
            'N° Factura',
            'Material',
            'Base',
            'Altura',
            'Cantidad de compra',
            'Presentación',
            'Cantidad convertida',
            'Unidad de conversión',
            'Costo unitario de conversión',
            'Costo por presentación',
            'Monto s/ IVA',
            'Monto c/ IVA'
        ],

        ...rows.map(row => [
            row.referenceNumber,
            row.receptionDate,
            row.receivedByName,
            row.supplierName,
            row.invoice,
            row.productName,
            row.productBase,
            row.productHeight,
            row.quantity,
            row.presentationName,
            row.convertedQuantity,
            row.unitMeasureName,
            row.conversionUnitCost,
            row.costPerUnitType,
            row.netPurchaseAmount,
            row.grossPurchaseAmount
        ])
    ];

    return sendExcelResponse({
        res,
        data,
        sheetName: GOODS_RECEIPT_SHEET_NAME,
        filename: GOODS_RECEIPT_FILENAME
    });
};
