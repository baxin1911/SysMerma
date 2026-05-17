import { toNumber } from "../../utils/formattersUtils.js";
import { findAllSupplierProducts } from "./products/supplierProductService.js";

const mapProductRows = (products = []) => products.map((item) => ({
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

export const findWarehouseReportRows = async () => {

    const productsResult = await findAllSupplierProducts({
        skip: 0,
        take: 100000,
        search: '',
        supplierId: null,
        orderBy: 'name',
        orderDir: 'asc'
    });

    return mapProductRows(productsResult.data);
};
