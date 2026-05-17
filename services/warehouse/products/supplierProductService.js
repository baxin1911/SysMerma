import { GoodsIssueInexistentStock, GoodsIssueInsufficientStock } from "../../../errors/inventory/stockError.js";
import { ProductSnapshotFindDatabaseError, SupplierProductCreateDatabaseError, SupplierProductDeleteDatabaseError } from "../../../errors/warehouse/productError.js";
import { getDb } from "../../../repository/baseRepository.js";
import { buildStockKey, parseStockKey } from "../../../utils/formattersUtils.js";

const MOVEMENT_TYPE_IN = 'IN';

export const findSupplierProduct = async ({
    tx,
    where,
    select
}) => {

    const db = getDb(tx);

    return db.supplierProduct.findMany({
        where,
        select
    });
};

export const findCurrentSupplierProductByProductId = async ({
    tx,
    productId
}) => {

    const db = getDb(tx);

    return db.supplierProduct.findFirst({
        where: { productId },
        select: { supplierId: true, maxUnitCost: true }
    });
};


const mapSupplierProduct = (sp) => {

    const { product, supplier, maxUnitCost, currentStock, convertedQuantity } = sp;

    return {
        ...product,
        maxUnitCost,
        currentStock,
        convertedQuantity,
        supplier: { ...supplier }
    };
};

export const findAllSupplierProducts = async ({
    skip= 0,
    take = 10,
    search = '',
    supplierId = null,
    orderBy = 'id',
    orderDir = 'asc'
}) => {

    const where = { AND: [] };

    if (search) where.AND.push({
        product: {
            name: {
                contains: search,
                mode: 'insensitive'
            }
        }
    });

    if (supplierId) where.AND.push({
        supplierId
    });

    if (where.AND.length === 0) delete where.AND;

    const supplierProducts = await getDb().supplierProduct.findMany({
        skip,
        take,
        where,
        select: {
            id: true,
            maxUnitCost: true,
            currentStock: true,
            convertedQuantity: true,
            product: {
                select: {
                    id: true,
                    name: true,
                    minStock: true,
                    isActive: true,
                    base: true,
                    height: true,
                    presentation: true,
                    unitMeasure: true
                }
            },

            supplier: {
                select: {
                    id: true,
                    code: true,
                    tradeName: true
                }
            }
        },
        orderBy: {
            product: {
                [orderBy]: orderDir
            }
        }
    });

    const sorted = supplierProducts.sort((a, b) => {

        const isLowStockA = Number(a.product.currentStock) < Number(a.product.minStock);
        const isLowStockB = Number(b.product.currentStock) < Number(b.product.minStock);

        if (isLowStockA !== isLowStockB) return isLowStockB - isLowStockA;

        return 0;
    });

    const total = await countTotalSupplierProducts();
    const filtered = await countTotalSupplierProducts({ where });

    return {
        data: sorted.map(mapSupplierProduct),
        recordsTotal: total,
        recordsFiltered: filtered
    };
}

export const findSupplierProductByIds = async ({
    tx,
    productId,
    supplierId
}) => {

    const db = getDb(tx);

    const supplierProduct = await db.supplierProduct.findUnique({
        where: { 
            supplierId_productId: { 
                productId, 
                supplierId 
            } 
        },
        select: {
            currentStock: true,
            convertedQuantity: true,
            maxUnitCost: true,
            product: {
                select: {
                    id: true,
                    name: true,
                    minStock: true,
                    isActive: true,
                    base: true,
                    height: true,
                    presentation: true,
                    unitMeasure: true
                }
            },
            supplier: {
                select: {
                    id: true,
                    code: true,
                    tradeName: true
                }
            }
        }
    });

    return mapSupplierProduct(supplierProduct);
};

export const findSupplierProductsSnapshot = async ({
    tx,
    pairs
}) => {

    const db = getDb(tx);

    const products = await db.supplierProduct.findMany({
        where: {
            OR: pairs
        },
        include: {
            product: {
                select: {
                    id: true,
                    name:true,
                    base: true,
                    height: true,
                    presentation: true,
                    unitMeasure: true
                }
            },
            supplier: {
                select: {
                    id: true,
                    tradeName: true
                }
            }
        }
    });

    return products.map(mapSupplierProduct);
}

export const countTotalSupplierProducts = async ({
    where
} = {}) => await getDb().supplierProduct.count({ where });

export const createSupplierProduct = async ({
    tx,
    supplierId,
    productId,
    maxUnitCost = null
}) => {

    const db = getDb(tx);

    return db.supplierProduct.create({
        data: {
            supplierId,
            productId,
            maxUnitCost
        }
    });
}


export const resolveMaxUnitCostForSync = async ({
    tx,
    supplierId,
    productId,
    fallbackMaxUnitCost
}) => {

    const db = getDb(tx);

    const exactSupplierProduct = await db.supplierProduct.findUnique({
        where: {
            supplierId_productId: {
                supplierId,
                productId
            }
        },
        select: { maxUnitCost: true }
    });

    return exactSupplierProduct?.maxUnitCost ?? fallbackMaxUnitCost;
};
export const updateProductUnitCostIfHigher = async ({
    supplierId,
    details
}) => {

    const db = getDb();

    const maxCostByProduct = {};

    for (const detail of details) {

        const { productId, conversionUnitCost } = detail;

        if (
            !maxCostByProduct[productId] ||
            conversionUnitCost > maxCostByProduct[productId]
        ) {
            maxCostByProduct[productId] = conversionUnitCost;
        }
    }

    await Promise.all(
        Object.entries(maxCostByProduct).map(([productId, cost]) =>
            db.supplierProduct.updateMany({
                where: {
                    supplierId,
                    productId,
                    OR: [
                        { maxUnitCost: null },
                        { maxUnitCost: { lt: cost } }
                    ]
                },
                data: {
                    maxUnitCost: cost
                }
            })
        )
    );
};

export const updateSupplierProductStock = async ({
    tx,
    grouped,
    movementType,
    supplierProducts
}) => {

    const db = getDb(tx);

    const psMap = new Map(supplierProducts.map(ps => [buildStockKey(ps.productId, ps.supplierId), ps]));

    const operations = [];

    for (const [key, quantity] of grouped.entries()) {

        const { productId, supplierId } = parseStockKey(key);

        const ps = psMap.get(key);

        if (!ps) throw new GoodsIssueInexistentStock({
            productName: ps?.product?.name ?? 'Producto desconocido',
            height: ps?.product?.height ?? 'Desconocido',
            base: ps?.product?.base ?? 'Desconocido',
            supplierName: ps?.supplier?.tradeName ?? 'Proveedor desconocido'
        });

        const hasDimensions = ps.product.base && ps.product.height;
        const factor = hasDimensions
            ? (ps.product.base * ps.product.height)
            : 1;

        if (movementType !== MOVEMENT_TYPE_IN) {

            const result = await db.supplierProduct.updateMany({
                where: {
                    supplierId,
                    productId,
                    currentStock: { gte: quantity }
                },
                data: {
                    currentStock: { decrement: quantity },
                    convertedQuantity: { decrement: quantity * factor }
                }
            });

            if (result.count === 0) {
                throw new GoodsIssueInsufficientStock({
                    productName: ps?.product?.name ?? 'Producto desconocido',
                    height: ps?.product?.height ?? 'Desconocido',
                    base: ps?.product?.base ?? 'Desconocido',
                    supplierName: ps?.supplier?.tradeName ?? 'Proveedor desconocido'
                });
            }

        } else {

            await db.supplierProduct.update({
                where: {
                    supplierId_productId: { supplierId, productId }
                },
                data: {
                    currentStock: { increment: quantity },
                    convertedQuantity: { increment: quantity * factor }
                }
            });
        }
    }
}

export const deleteSupplierProduct = async ({
    tx,
    productId,
    supplierId
}) => {

    const db = getDb(tx);

    return await db.supplierProduct.delete({
        where: {
            supplierId_productId: {productId, supplierId }
        }
    });
}
