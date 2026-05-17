import { createSupplierProduct, deleteSupplierProduct, resolveMaxUnitCostForSync } from "./supplierProductService.js";


export const syncSupplierProduct = async ({
    tx,
    supplierId,
    previousSupplierId = null,
    previousMaxUnitCost = null,
    productId,
    isUpdate = false
}) => {

    if (isUpdate && previousSupplierId === supplierId) return;

    if (isUpdate && previousSupplierId) {
        await deleteSupplierProduct({
            tx,
            productId,
            supplierId: previousSupplierId
        });
    }

    const maxUnitCost = isUpdate
        ? await resolveMaxUnitCostForSync({
            tx,
            supplierId,
            productId,
            fallbackMaxUnitCost: previousMaxUnitCost
        })
        : null;

    await createSupplierProduct({
        tx,
        supplierId,
        productId,
        maxUnitCost
    });
};