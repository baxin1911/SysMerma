export const createGoodsIssueDtoForRegister = (body = {}) => ({
    requesterId: body.requesterId.trim(),
    advisorId: body.advisorId.trim(),
    clientId: body.clientId.trim(),
    departmentId: body.departmentId.trim(),
    projectNumber: body.projectNumber.trim(),
    requestDate: new Date(body.requestDate),
    ...(Object.prototype.hasOwnProperty.call(body, 'observations') ? { observations: body.observations.trim() } : {}),
    details: (body.details).map(d => ({
        productId: d.productId.trim(),
        supplierId: d.supplierId.trim(),
        quantity: Number(d.quantity)
    }))
});


export const createGoodsIssueDetailsDtoForUpdate = (body = {}) => ({
    details: (body.details || []).map((detail) => ({
        id: detail.id?.trim(),
        projectConvertedQuantity: Number(detail.projectConvertedQuantity),
        isSupplied: detail.isSupplied
    }))
});
