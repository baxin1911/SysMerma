import { validateDate, validateGoodsIssueDetailIds, validateGoodsIssueDetailSupplierIds, validateGoodsIssueDetailsArray, validateGoodsIssueDetailsEdition, validateProjectNumber, validateTextOptional, validateUUID } from "../fields/fieldsValidator.js";

export const goodsIssueValidation = [
    validateUUID('advisorId'),
    validateUUID('clientId'),
    validateUUID('departmentId'),
    validateUUID('requesterId'),
    validateProjectNumber('projectNumber'),
    validateDate('requestDate'),
    validateTextOptional('observations'),
    validateGoodsIssueDetailSupplierIds,
    validateGoodsIssueDetailsArray()
];

export const goodsIssueUpdateValidation = [
    validateUUID('advisorId'),
    validateUUID('clientId'),
    validateUUID('departmentId'),
    validateUUID('requesterId'),
    validateProjectNumber('projectNumber'),
    validateDate('requestDate'),
    validateTextOptional('observations'),
    validateGoodsIssueDetailIds(),
    validateGoodsIssueDetailSupplierIds,
    validateGoodsIssueDetailsArray({ allowDetailId: true })
];

export const goodsIssueDetailsValidation = [
    validateGoodsIssueDetailIds({ required: true }),
    validateGoodsIssueDetailsEdition
];
