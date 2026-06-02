import { getDb } from "../../repository/baseRepository.js";
import { generateReferenceNumber } from "../document/referenceNumberService.js";
import { createStockAdjustmentMovement } from "../inventory/movementService.js";
import { adjustSupplierProductStock, findSupplierProductByIds } from "./products/supplierProductService.js";

const REFERENCE_NUMBER_TYPE = 'AJU';
const ADJUSTMENT_STATUS_APPLIED = 'APPLIED';
const STOCK_ADJUSTMENT_INCREASE = 'INCREASE';
const STOCK_ADJUSTMENT_DECREASE = 'DECREASE';

const applyStockAdjustment = async ({
    tx,
    productId,
    supplierId,
    reasonId,
    observations,
    newStock,
    userId
}) => {

    const product = await findSupplierProductByIds({
        tx,
        productId,
        supplierId
    });

    const referenceNumber = await generateReferenceNumber({ type: REFERENCE_NUMBER_TYPE, tx });

    const previousStock = Number(product.currentStock);

    const difference = newStock - previousStock;

    const adjustmentType = difference >= 0
        ? STOCK_ADJUSTMENT_INCREASE
        : STOCK_ADJUSTMENT_DECREASE;

    const previousConvertedQuantity = Number(product.convertedQuantity);

    const conversionFactor =
        (Number(product.base || 1) * Number(product.height || 1));

    const newConvertedQuantity =
        newStock * conversionFactor;

    const convertedDifference =
        newConvertedQuantity - previousConvertedQuantity;

    const adjustment = await tx.stockAdjustment.create({
        data: {
            referenceNumber,
            type: adjustmentType,
            observations,
            status: ADJUSTMENT_STATUS_APPLIED,
            appliedAt: new Date(),
            reason: {
                connect: {
                    id: reasonId
                }
            },
            createdBy: {
                connect: {
                    id: userId
                }
            },
            details: {
                create: {
                    productId,
                    supplierId,

                    previousStock,
                    newStock,
                    difference,

                    previousConvertedQuantity,
                    newConvertedQuantity,
                    convertedDifference,

                    productBase: product.base,
                    productHeight: product.height
                }
            }
        },
        include: {
            details: true
        }
    });

    await createStockAdjustmentMovement({
        tx,
        adjustment,
        productId,
        supplierId,
        reasonId,
        previousStock,
        previousConvertedQuantity,
        newStock,
        newConvertedQuantity,
        difference,
        convertedDifference
    });

    await adjustSupplierProductStock({
        tx,
        productId,
        supplierId,
        newStock,
        newConvertedQuantity
    });

    return findSupplierProductByIds({
        tx,
        productId,
        supplierId
    });
};

export const createStockAdjustment = async ({
    tx = null,
    productId,
    supplierId,
    reasonId,
    observations,
    newStock,
    userId
}) => {

    if (tx) {
        return applyStockAdjustment({
            tx,
            productId,
            supplierId,
            reasonId,
            observations,
            newStock,
            userId
        });
    }

    return await getDb().$transaction((transaction) => applyStockAdjustment({
        tx: transaction,
        productId,
        supplierId,
        reasonId,
        observations,
        newStock,
        userId
    }));
};
