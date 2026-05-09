import { ProductSnapshotFindDatabaseError, ProductCreateDatabaseError, ProductNotFound, ProductUpdateDatabaseError } from "../../../errors/warehouse/productError.js";
import { getDb } from "../../../repository/baseRepository.js";
import { findAllSupplierProducts, findSupplierProductByIds } from "./supplierProductService.js";
import { prepareProductData, withRetry } from "./productHelpers.js";
import { syncSupplierProduct } from "./productRelations.js";
import { AppError } from "../../../errors/AppError.js";

const REFERENCE_MOVEMENT_IN = 'IN';
const PRISMA_RECORD_NOT_FOUND = 'P2025';

const createProductInTransaction = async ({
    tx,
    productDto
}) => {

    const {
        rest,
        relations
    } = await prepareProductData({ tx, productDto });

    const createdProduct = await tx.product.create({
        data: {
            ...rest,
            presentation: {
                connect: { id: relations.presentationId }
            },
            unitMeasure: {
                connect: { id: relations.unitMeasureId }
            }
        },
        select: {
            id: true
        }
     });

    await syncSupplierProduct({
        tx,
        supplierId: relations.supplierId,
        productId: createdProduct.id,
    });

    return findSupplierProductByIds({
        tx,
        productId: createdProduct.id,
        supplierId: relations.supplierId
    });
};

export const findAllProducts = async ({
    skip = 0,
    take = 10,
    search = '',
    supplierId = null,
    orderBy = 'name',
    orderDir = 'asc'
}) => {

    return await findAllSupplierProducts({
        skip,
        take,
        search,
        supplierId,
        orderBy,
        orderDir
    });
};

export const findProductsSnapshot = async ({
    tx,
    productIds
}) => {

    const db = getDb(tx);

    const products = await db.product.findMany({
        where: {
            id: {
                in: productIds
            }
        },
        select: {
            id: true,
            name: true,
            minStock: true,
            base: true,
            height: true,
            presentation: true,
            unitMeasure: true
        }
    });

    return products;
}

export const createProduct = async (productDto) => {

    return withRetry(async () => {

        return getDb().$transaction((tx) =>
            createProductInTransaction({
                tx,
                productDto
            })
        );

    }).catch(() => {

        if (err instanceof AppError) throw err;
        
        throw new ProductCreateDatabaseError();
    });
};

export const updateProduct = async (productDto, id) => {

    return withRetry(async () => {

        return await getDb().$transaction(async (tx) => {

            const productExists = await tx.product.findUnique({
                where: { id },
                select: { id: true }
            });

            if (!productExists) throw new ProductNotFound();

            const {
                rest,
                relations
            } = await prepareProductData({
                tx,
                productDto,
                productId: id
            });

            const updatedProduct = await tx.product.update({
                where: { id },
                data: {
                    ...rest,
                    supplier: {
                        connect: { id: relations.supplierId }
                    },
                    presentation: {
                        connect: { id: relations.presentationId }
                    },
                    unitMeasure: {
                        connect: { id: relations.unitMeasureId }
                    }
                }
            });

            await syncSupplierProduct({
                tx,
                supplierId: relations.supplierId,
                productId: id,
                isUpdate: true
            });

            const fullProduct = await findSupplierProductByIds({
                tx,
                productId: updatedProduct.id,
                supplierId: relations.supplierId
            });

            return fullProduct;
        });

    }).catch((err) => {

        if (err.code === PRISMA_RECORD_NOT_FOUND) {
            throw new ProductNotFound();
        }

        if (err instanceof AppError) throw err;

        throw new ProductUpdateDatabaseError();
    });
};