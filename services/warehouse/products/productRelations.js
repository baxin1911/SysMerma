import { createSupplierProduct, deleteSupplierProduct } from "./supplierProductService.js";

export const syncSupplierProduct = async ({
    tx,
    supplierId,
    productId,
    isUpdate = false
}) => {

    if (isUpdate) {
        await deleteSupplierProduct({
            tx,
            productId,
            supplierId
        });
    }

    await createSupplierProduct({
        tx,
        supplierId,
        productId,
    });
};