import { formatDateLongWithTime, toNumber } from "../../utils/formattersUtils.js";
import { findAllSupplierProducts } from "./products/supplierProductService.js";
import { findAllGoodsIssues } from "./goodsIssues/goodsIssueService.js";
import { findAllGoodsReceipts } from "./goodsReceipts/goodsReceiptService.js";

const mapProductRows = (products = []) => products.map((item) => ({
    supplier: item.supplier?.tradeName,
    name: item.name,
    base: toNumber(item.base),
    height: toNumber(item.height),
    currentStock: toNumber(item.currentStock),
    minStock: toNumber(item.minStock),
    presentation: item.presentation?.name,
    convertedQuantity: toNumber(item.convertedQuantity),
    unitMeasure: item.unitMeasure?.name,
    maxUnitCost: toNumber(item.maxUnitCost)
}));

const mapGoodsIssueDetailRows = (goodsIssues = []) => goodsIssues.flatMap((goodsIssue) => {

    const details = goodsIssue.details || [];

    return details.map((detail) => ({
        referenceNumber: goodsIssue.referenceNumber,
        requestDate: formatDateLongWithTime(goodsIssue.requestDate),
        departmentName: goodsIssue.departmentName,
        requesterName: goodsIssue.requesterName,
        clientName: goodsIssue.clientName,
        projectNumber: goodsIssue.projectNumber,
        fulfillmentStatusName: goodsIssue.fulfillmentStatus?.name,
        productName: detail.productName,
        supplierName: detail.supplierName,
        productBase: toNumber(detail.productBase),
        productHeight: toNumber(detail.productHeight),
        requestedQuantity: toNumber(detail.quantity),
        presentationName: detail.presentationName,
        convertedQuantity: toNumber(detail.convertedQuantity),
        convertedUnitMeasureName: detail.unitMeasureSymbol || detail.unitMeasureName,
        suppliedQuantity: toNumber(detail.suppliedQuantity),
        suppliedUnitMeasureName: detail.unitMeasureSymbol || detail.unitMeasureName,
        detailFulfillmentStatusName: detail.fulfillmentStatus?.name
    }));
});

const mapGoodsReceiptDetailRows = (goodsReceipts = []) => goodsReceipts.flatMap((goodsReceipt) => {

    const details = goodsReceipt.details || [];

    return details.map((detail) => ({
        referenceNumber: goodsReceipt.referenceNumber,
        receptionDate: formatDateLongWithTime(goodsReceipt.receptionDate),
        receivedByName: goodsReceipt.receivedByName,
        supplierName: goodsReceipt.supplierName,
        invoice: goodsReceipt.isInvoiced ? goodsReceipt.invoice : 'Sin factura',
        productName: detail.productName,
        productBase: toNumber(detail.productBase),
        productHeight: toNumber(detail.productHeight),
        quantity: toNumber(detail.quantity),
        presentationName: detail.presentationName,
        convertedQuantity: toNumber(detail.convertedQuantity),
        unitMeasureName: detail.unitMeasureSymbol || detail.unitMeasureName,
        conversionUnitCost: toNumber(detail.conversionUnitCost),
        costPerUnitType: toNumber(detail.costPerUnitType),
        netPurchaseAmount: toNumber(detail.netPurchaseAmount),
        grossPurchaseAmount: toNumber(detail.grossPurchaseAmount)
    }));
});

export const findWarehouseReportRows = async ({
    search = '',
    orderBy = 'name',
    orderDir = 'asc'
} = {}) => {

    const productsResult = await findAllSupplierProducts({
        skip: 0,
        take: 100000,
        search,
        supplierId: null,
        orderBy,
        orderDir
    });

    return mapProductRows(productsResult.data);
};

export const findGoodsIssueReportRows = async ({
    search = '',
    fulfillmentStatusId = '',
    accesses = [],
    orderBy = 'referenceNumber',
    orderDir = 'desc'
} = {}) => {

    const goodsIssuesResult = await findAllGoodsIssues({
        skip: 0,
        take: 100000,
        search,
        fulfillmentStatusId,
        orderBy,
        orderDir,
        accesses
    });

    return mapGoodsIssueDetailRows(goodsIssuesResult.data);
};

export const findGoodsReceiptReportRows = async ({
    search = '',
    orderBy = 'referenceNumber',
    orderDir = 'desc'
} = {}) => {

    const goodsReceiptsResult = await findAllGoodsReceipts({
        skip: 0,
        take: 100000,
        search,
        orderBy,
        orderDir
    });

    return mapGoodsReceiptDetailRows(goodsReceiptsResult.data);
};
