import { MovementFindDatabaseError } from "../../errors/inventory/movementError.js";
import { getDb } from "../../repository/baseRepository.js";

export const findAllMovements = async ({
    skip = 0,
    take = 10,
    type = '',
    search = '',
    productId = '',
    supplierId = '',
    goodsIssueId = '',
    goodsReceiptId = '',
    stockAdjustmentId = '',
    orderBy = 'date',
    orderDir = 'asc',
}) => {

    const db = getDb();

    const movementFilters = {
        ...(type && { type }),

        ...(goodsIssueId && { goodsIssueId }),

        ...(goodsReceiptId && { goodsReceiptId }),

        ...(stockAdjustmentId && { stockAdjustmentId })
    };

    const where = {

        ...(productId && {
            productId
        }),

        ...(supplierId && {
            supplierId
        }),

        ...(Object.keys(movementFilters).length > 0 && {
            movement: movementFilters
        })
    };

    try {

        const movements = await db.movementDetail.findMany({
            skip,
            take,

            where,

            include: {

                product: {
                    select: {
                        name: true
                    }
                },

                supplier: {
                    select: {
                        tradeName: true
                    }
                },

                movement: {
                    select: {
                        id: true,
                        type: true,
                        date: true,
                        referenceNumber: true,

                        goodsIssue: {
                            select: {
                                referenceNumber: true
                            }
                        },

                        goodsReceipt: {
                            select: {
                                referenceNumber: true
                            }
                        },

                        stockAdjustment: {
                            select: {
                                referenceNumber: true
                            }
                        }
                    }
                }
            }
        });

        const movementsMapper = movements.map(detail => ({
            id: detail.id,

            date: detail.movement.date,

            type: detail.movement.type,

            productName: detail.product.name,

            supplierName: detail.supplier?.tradeName,

            quantity: detail.quantity,

            convertedQuantity: detail.convertedQuantity,

            previousStock: detail.previousStock,

            newStock: detail.newStock,

            referenceNumber:
                detail.movement.goodsIssue?.referenceNumber ||
                detail.movement.goodsReceipt?.referenceNumber ||
                detail.movement.referenceNumber
        }));
        
        const total = await db.movementDetail.count();
        const filtered = await db.movementDetail.count({ where });

        return {
            data: movementsMapper,
            recordsTotal: total,
            recordsFiltered: filtered
        };

    } catch (err) {

        throw new MovementFindDatabaseError();
    }
}