import { MovementDetailRelationConflict } from "../../errors/inventory/movementError.js";
import { InventoryMovementType } from "../../generated/prisma/enums.ts";
import { getDb } from "../../repository/baseRepository.js";
import { buildStockKey } from "../../utils/formattersUtils.js";
import { updateSupplierProductStock } from "../warehouse/products/supplierProductService.js";

const REFERENCE_TYPE_GOODS_RECEIPT = 'GOODS_RECEIPT';
const REFERENCE_TYPE_GOODS_ISSUE = 'GOODS_ISSUE';
const REFERENCE_TYPE_PURCHASE_REQUISITION = 'PURCHASE_REQUISITION';
const MOVEMENT_TYPE_OUT = 'ISSUE';
const FLOAT_EPSILON = 0.000001;

export const round2 = (value) =>
    Math.round((Number(value) + Number.EPSILON) * 100) / 100;

export const normalizeDecimal = (value) => {

    const rounded = round2(value);

    return Math.abs(rounded) <= FLOAT_EPSILON
        ? 0
        : rounded;
};

export const applyInventoryMovement = async ({
    tx,
    reference = {},
    details,
    movementType,
    grouped,
    supplierProducts
}) => {

    for (const detail of details) {

        if (!detail.productId || !detail.supplierId) {
            throw new MovementDetailRelationConflict();
        }
    }

    const db = getDb(tx);

    const psMap = new Map(
        supplierProducts.map(ps => [
            buildStockKey(ps.productId, ps.supplierId),
            ps
        ])
    );

    const movementDetails = details.map(detail => {

        const key = buildStockKey(detail.productId, detail.supplierId);

        const ps = psMap.get(key);

        if (!ps) {

            throw new GoodsIssueInexistentStock({
                productName: ps?.product?.name ?? 'Producto desconocido',
                height: ps?.product?.height ?? 'Desconocido',
                base: ps?.product?.base ?? 'Desconocido',
                supplierName: ps?.supplier?.tradeName ?? 'Proveedor desconocido'
            });
        }

        const base = Number(ps.product.base || 0);

        const height = Number(ps.product.height || 0);

        const factor =
            base > 0 && height > 0
                ? base * height
                : 1;

        const quantity = normalizeDecimal(detail.quantity);

        const rawConvertedQuantity = quantity * factor;

        const convertedQuantity =
            Math.abs(rawConvertedQuantity) <= FLOAT_EPSILON
                ? 0
                : normalizeDecimal(rawConvertedQuantity);

        const previousStock = normalizeDecimal(ps.currentStock || 0);

        const previousConvertedQuantity = normalizeDecimal(
            ps.convertedQuantity || 0
        );

        const isOut = movementType === MOVEMENT_TYPE_OUT;

        const signedQuantity = normalizeDecimal(
            isOut
                ? -quantity
                : quantity
        );

        const signedConvertedQuantity = normalizeDecimal(
            isOut
                ? -convertedQuantity
                : convertedQuantity
        );

        const newStock = normalizeDecimal(
            previousStock + signedQuantity
        );

        const newConverted = normalizeDecimal(
            previousConvertedQuantity + signedConvertedQuantity
        );

        /**
         * MUY IMPORTANTE:
         * actualizamos el estado local
         * para acumulaciones dentro
         * de la misma transacción
         */
        ps.currentStock = newStock;

        ps.convertedQuantity = newConverted;

        return {
            productId: detail.productId,
            supplierId: detail.supplierId,

            quantity: signedQuantity,
            convertedQuantity: signedConvertedQuantity,

            previousStock,
            newStock,

            previousConvertedQuantity,
            newConvertedQuantity: newConverted,

            productBase: base,
            productHeight: height,

            ...(detail.goodsReceiptDetailId && {
                goodsReceiptDetailId: detail.goodsReceiptDetailId
            }),

            ...(detail.goodsIssueDetailId && {
                goodsIssueDetailId: detail.goodsIssueDetailId
            }),

            ...(detail.stockAdjustmentDetailId && {
                stockAdjustmentDetailId: detail.stockAdjustmentDetailId
            })
        };
    });

    const movement = await db.inventoryMovement.create({
        data: {
            ...reference,
            type: movementType,
            details: {
                create: movementDetails
            }
        },
        include: {
            details: true
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