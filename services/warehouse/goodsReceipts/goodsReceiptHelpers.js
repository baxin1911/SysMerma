import { ProductNotFound } from "../../../errors/warehouse/productError.js";
import { roundTo } from "../../../utils/formattersUtils.js";
import { findProductsSnapshot } from "../products/productService.js";

const IVA_RATE = 1.16;

export const buildGoodsReceiptDetails = async (details) => {

    const productIds = details.map(d => d.productId);

    const products = await findProductsSnapshot({ productIds });

    const productMap = new Map(products.map(p => [p.id, p]));

    return details.map(({ productId, quantity, costPerUnitType }) => {

        const product = productMap.get(productId);

        if (!product) throw new ProductNotFound();

        const { name, base, height, presentation, unitMeasure } = product;
        const netPurchaseAmount = roundTo(quantity * costPerUnitType);
        const grossPurchaseAmount = roundTo(netPurchaseAmount * IVA_RATE);
        const hasDimensions = base !== null && height !== null && base > 0 && height > 0;
        const convertedQuantity = hasDimensions ? roundTo((Number(base) * Number(height)) * quantity) : quantity;
        let conversionUnitCost = null;

        if (convertedQuantity) conversionUnitCost = convertedQuantity > 0 ? roundTo(netPurchaseAmount / convertedQuantity) : 0;

        return {
            productId,
            quantity,
            convertedQuantity,
            costPerUnitType,
            conversionUnitCost,
            netPurchaseAmount,
            grossPurchaseAmount,
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