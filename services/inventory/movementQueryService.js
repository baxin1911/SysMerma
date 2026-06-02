import { MovementFindDatabaseError } from "../../errors/inventory/movementError.js";
import { getDb } from "../../repository/baseRepository.js";
import { formatDateLongWithTime } from "../../utils/formattersUtils.js";

const REFERENCE_NUMBER_SELECT = {
    referenceNumber: true
};

const MOVEMENT_DETAIL_SELECT = {
    id: true,
    productBase: true,
    productHeight: true,
    quantity: true,
    previousConvertedQuantity: true,
    convertedQuantity: true,
    newConvertedQuantity: true,
    previousStock: true,
    newStock: true,
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
                select: REFERENCE_NUMBER_SELECT
            },
            goodsReceipt: {
                select: REFERENCE_NUMBER_SELECT
            },
            stockAdjustment: {
                select: REFERENCE_NUMBER_SELECT
            }
        }
    }
};

const getMovementDateFilter = ({ startDate, endDate }) => {

    if (!startDate && !endDate) return {};

    return {
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
    };
};

const getMovementSearchFilter = (search) => {

    if (!search) return {};

    return {
        OR: [
            {
                product: {
                    name: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            },
            {
                supplier: {
                    tradeName: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            },
            {
                movement: {
                    referenceNumber: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            },
            {
                movement: {
                    goodsIssue: {
                        referenceNumber: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                }
            },
            {
                movement: {
                    goodsReceipt: {
                        referenceNumber: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                }
            },
            {
                movement: {
                    stockAdjustment: {
                        referenceNumber: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                }
            }
        ]
    };
};

const mapMovementDetail = (detail) => ({
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
});

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

    try {

        const movementFilters = {
            ...(movementType && { type: movementType }),
            ...getMovementDateFilter({ startDate, endDate })
        };

        const where = {

            ...(productId && {
                productId
            }),

            ...(supplierId && {
                supplierId
            }),

            ...getMovementSearchFilter(search),

            ...(Object.keys(movementFilters).length > 0 && {
                movement: movementFilters
            })
        };

        const movements = await db.movementDetail.findMany({
            skip,
            take,
            orderBy: {
                movement: {
                    [orderBy]: orderDir
                }
            },
            where,
            select: MOVEMENT_DETAIL_SELECT
        });

        const total = await db.movementDetail.count();
        const filtered = await db.movementDetail.count({ where });

        return {
            data: movements.map(mapMovementDetail),
            recordsTotal: total,
            recordsFiltered: filtered
        };

    } catch (err) {

        throw new MovementFindDatabaseError();
    }
}
