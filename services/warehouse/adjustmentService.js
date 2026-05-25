import { AdjustmentStatus, InventoryMovementType, StockAdjustmentType } from "../../generated/prisma/enums.ts";
import { getDb } from "../../repository/baseRepository.js";
import { generateReferenceNumber } from "../document/referenceNumberService.js";
import { createStockAdjustmentMovement } from "../inventory/movementService.js";
import { adjustSupplierProductStock, findSupplierProductByIds } from "./products/supplierProductService.js";

const REFERENCE_NUMBER_TYPE = 'AJU';

export const createStockAdjustment = async ({
    productId,
    supplierId,
    reasonId,
    observations,
    newStock,
    userId
}) => {

    const product = await findSupplierProductByIds({
        productId,
        supplierId
    });

    return await getDb().$transaction(async (tx) => {

        const referenceNumber = await generateReferenceNumber({ type: REFERENCE_NUMBER_TYPE, tx });

        const previousStock = Number(product.currentStock);

        const difference = newStock - previousStock;

        const adjustmentType = difference >= 0
            ? StockAdjustmentType.INCREASE
            : StockAdjustmentType.DECREASE;

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
                status: AdjustmentStatus.APPLIED,
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
                approvedBy: {
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

        const updatedProduct = await adjustSupplierProductStock({
            tx,
            productId,
            supplierId,
            newStock,
            newConvertedQuantity
        });

        return updatedProduct;
    });
};