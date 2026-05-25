import { MovementDetailRelationConflict } from "../../errors/inventory/movementError.js";
import { InventoryMovementType } from "../../generated/prisma/enums.ts";
import { getDb } from "../../repository/baseRepository.js";
import { buildStockKey } from "../../utils/formattersUtils.js";
import { updateSupplierProductStock } from "../warehouse/products/supplierProductService.js";

const REFERENCE_TYPE_GOODS_RECEIPT = 'GOODS_RECEIPT';
const REFERENCE_TYPE_GOODS_ISSUE = 'GOODS_ISSUE';
const REFERENCE_TYPE_PURCHASE_REQUISITION = 'PURCHASE_REQUISITION';

export const applyInventoryMovement = async ({
    tx,
    reference = {},
    details,
    movementType,
    grouped,
    supplierProducts
}) => {

    for (const detail of details) {

        if (!detail.productId || !detail.supplierId) throw new MovementDetailRelationConflict();
    }

    const db = getDb(tx);

    const data = {
        ...reference,
        details: {
            create: details.map(detail => ({
                productId: detail.productId,
                supplierId: detail.supplierId,
                quantity: detail.quantity,
                ...(detail.goodsReceiptDetailId && { goodsReceiptDetailId: detail.goodsReceiptDetailId }),
                ...(detail.goodsIssueDetailId && { goodsIssueDetailId: detail.goodsIssueDetailId })
            }))
        }
    };

    const movement = await db.inventoryMovement.create({
        data,
        include: {
            details: {
                select: {
                    productId: true,
                    supplierId: true,
                    quantity: true
                }
            }
        }
    });

    await updateSupplierProductStock({
        tx,
        grouped,
        movementType,
        supplierProducts
    });

    return movement;
};

export const createStockAdjustmentMovement = async ({
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
}) => {

    const db = getDb(tx);

    return await db.inventoryMovement.create({
        data: {
            type: InventoryMovementType.ADJUSTMENT,
            stockAdjustment: {
                connect: {
                    id: adjustment.id
                }
            },

            details: {
                create: {
                    quantity: difference,
                    newStock,
                    newConvertedQuantity,
                    convertedQuantity: convertedDifference,
                    previousStock,
                    previousConvertedQuantity,
                    product: {
                        connect: {
                            id: productId
                        }
                    },
                    supplier: {
                        connect: {
                            id: supplierId
                        }
                    },
                    stockAdjustmentDetail: {
                        connect: {
                            id: adjustment.details[0].id
                        }
                    }
                }
            }
        }
    });
}