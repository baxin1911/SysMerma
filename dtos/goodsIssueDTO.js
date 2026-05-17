const createGoodsIssueDto = (body = {}, { includeDetailId = false } = {}) => ({
    requesterId: body.requesterId.trim(),
    advisorId: body.advisorId.trim(),
    clientId: body.clientId.trim(),
    departmentId: body.departmentId.trim(),
    projectNumber: body.projectNumber.trim(),
    requestDate: new Date(body.requestDate),
    ...(Object.prototype.hasOwnProperty.call(body, 'observations') ? { observations: body.observations.trim() } : {}),
    details: (body.details).map(d => ({
        ...(includeDetailId && d.id ? { id: d.id.trim() } : {}),
        productId: d.productId.trim(),
        supplierId: d.supplierId.trim(),
        ...(d.presentationId ? { presentationId: d.presentationId.trim() } : {}),
        quantity: Number(d.quantity)
    }))
});

export const createGoodsIssueDtoForRegister = (body = {}) => createGoodsIssueDto(body);

export const createGoodsIssueDtoForEdit = (body = {}) => createGoodsIssueDto(body, { includeDetailId: true });

export const createGoodsIssueDetailsDtoForEdit = (body = {}) => ({
    details: (body.details).map(d => ({
        id: d.id,
        isSupplied: Boolean(d.isSupplied),
        projectConvertedQuantity: Number(d.projectConvertedQuantity)
    }))
});