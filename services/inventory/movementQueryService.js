import { MovementFindDatabaseError } from "../../errors/inventory/movementError.js";
import { getDb } from "../../repository/baseRepository.js";
import { formatDateLongWithTime } from "../../utils/formattersUtils.js";

export const findAllMovements = async ({
    skip = 0,
    take = 10,
    startDate = '',
    endDate = '',
    movementType = '',
    search = '',
    productId = '',
    supplierId = '',
    orderBy = 'date',
    orderDir = 'asc',
}) => {

    const db = getDb();

    const movementFilters = {
        ...(movementType && { type: movementType }),

        ...((startDate || endDate) && {
            date: {

                ...(startDate && {
                    gte: new Date(startDate)
                }),

                ...(endDate && (() => {

                    const nextDay = new Date(endDate);
                    nextDay.setDate(nextDay.getDate() + 1);

                    return {
                        lt: nextDay
                    };
                })())
            }
        })
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
            orderBy: {
                movement: {
                    [orderBy]: orderDir
                }
            },
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

            date: formatDateLongWithTime(detail.movement.date),

            type: detail.movement.type,

            productName: detail.product.name,

            productBase: detail.productBase,

            productHeight: detail.productHeight,

            supplierName: detail.supplier?.tradeName,

            quantity: detail.quantity,

            previousConvertedQuantity: detail.previousConvertedQuantity,

            convertedQuantity: detail.convertedQuantity,

            newConvertedQuantity: detail.newConvertedQuantity,

            previousStock: detail.previousStock,

            newStock: detail.newStock,

            referenceNumber:
                detail.movement.goodsIssue?.referenceNumber ||
                detail.movement.goodsReceipt?.referenceNumber ||
                detail.movement.stockAdjustment?.referenceNumber ||
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