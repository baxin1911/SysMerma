import { toNumber } from "../../utils/formattersUtils.js";
import { findAllMovements } from "./movementQueryService.js";

export const findMovementReportRows = async () => {

    const movementsResult = await findAllMovements({
        skip: 0,
        take: 100000,
        type: '',
        search: '',
        productId: '',
        supplierId: '',
        goodsIssueId: '',
        goodsReceiptId: '',
        stockAdjustmentId: '',
        orderBy: 'date',
        orderDir: 'desc',
    });

    return movementsResult.data.map((movement) => ({
        ...movement,
        previousStock: toNumber(movement.previousStock),
        quantity: toNumber(movement.quantity),
        newStock: toNumber(movement.newStock),
        previousConvertedQuantity: toNumber(movement.previousConvertedQuantity),
        convertedQuantity: toNumber(movement.convertedQuantity),
        newConvertedQuantity: toNumber(movement.newConvertedQuantity),
    }));
};