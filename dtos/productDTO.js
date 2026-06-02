export const createProductDtoForRegister = (body = {}) => ({
    name: body.name.trim(),
    supplierId: body.supplierId,
    presentationId: body.presentationId,
    unitMeasureId: body.unitMeasureId,
    minStock: Number(body.minStock),
    base: body.base ? Number(body.base) : null,
    height: body.height ? Number(body.height) : null,
    ...(Object.prototype.hasOwnProperty.call(body, 'isActive') ? { isActive: Boolean(body.isActive) } : {}),
    ...(body.newStock !== undefined && body.newStock !== '' ? { initialStock: Number(body.newStock) } : {}),
    ...(body.reasonId ? { reasonId: body.reasonId } : {}),
    ...(Object.prototype.hasOwnProperty.call(body, 'observations') ? { observations: body.observations ? body.observations.trim() : null } : {})
});

export const createProductDtoForStockUpdate = (body = {}) => ({
    supplierId: body.supplierId,
    newStock: Number(body.newStock),
    ...Object.prototype.hasOwnProperty.call(body, 'observations') ? { observations: body.observations ? body.observations.trim() : null } : {},
    reasonId: body.reasonId
});
