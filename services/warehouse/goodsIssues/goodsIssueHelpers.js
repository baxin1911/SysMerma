import { ProductNotFound } from "../../../errors/warehouse/productError.js";
import { GoodsIssueMissingMaxUnitCost } from "../../../errors/inventory/stockError.js";
import { buildStockKey, roundTo } from "../../../utils/formattersUtils.js";
import { findSupplierProductsSnapshot } from "../products/supplierProductService.js";

const FLOAT_EPSILON = 0.000001;
const FULFILLMENT_PENDING = 'Pendiente';
const FULFILLMENT_PARTIAL = 'Surtido parcial';
const FULFILLMENT_COMPLETE = 'Surtido';

export const buildGoodsIssueDetails = async ({
    details
}) => {

    const pairs = [
        ...new Map(
            details.map(detail => [
                buildStockKey(detail.productId, detail.supplierId),
                {
                    productId: detail.productId,
                    supplierId: detail.supplierId
                }
            ])
        ).values()
    ];

    const supplierProducts = await findSupplierProductsSnapshot({ pairs });

    const spMap = new Map(
        supplierProducts.map(sp => [
            buildStockKey(sp.id, sp.supplier.id),
            sp
        ])
    );

    return details.map(({ productId, quantity, supplierId }) => {

        const key = buildStockKey(productId, supplierId);
        const sp = spMap.get(key);

        if (!sp) throw new ProductNotFound();

        const { name, base, height, presentation, unitMeasure, maxUnitCost } = sp;
        const hasDimensions = base !== null && height !== null && base > 0 && height > 0;
        const convertedQuantity = hasDimensions ? roundTo((base * height) * quantity) : quantity;

        if (maxUnitCost === null || maxUnitCost === undefined) {
            throw new GoodsIssueMissingMaxUnitCost({
                productName: name,
                height,
                base,
                supplierName: sp.supplier.tradeName
            });
        }

        return {
            productId,
            supplierId,
            supplierName: sp.supplier.tradeName,
            quantity,
            convertedQuantity,
            maxUnitCost,
            productName: name,
            productBase: base,
            productHeight: height,
            presentationId: presentation.id,
            presentationName: presentation.name,
            unitMeasureId: unitMeasure.id,
            unitMeasureName: unitMeasure.name,
            unitMeasureSymbol: unitMeasure.symbol
        };
    });
}

export const resolveFulfillmentStatus = (details) => {

    const allSupplied = details.every((d) => d.isSupplied);

    const anySupplied = details.some(
        (d) => (d.suppliedQuantity ?? 0) > FLOAT_EPSILON
    );

    return allSupplied
        ? FULFILLMENT_COMPLETE
        : (anySupplied ? FULFILLMENT_PARTIAL : FULFILLMENT_PENDING);
};
