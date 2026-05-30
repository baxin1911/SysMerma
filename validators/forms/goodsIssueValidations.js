import { validateDate, validateGoodsIssueDetailsArray, validateGoodsIssueDetailsEdition, validateProjectNumber, validateTextOptional, validateUUID } from "../fields/fieldsValidator.js";

export const goodsIssueValidation = [
    validateUUID('advisorId'),
    validateUUID('clientId'),
    validateUUID('departmentId'),
    validateUUID('requesterId'),
    validateProjectNumber('projectNumber'),
    validateDate('requestDate'),
    validateTextOptional({ fieldName: 'observations', maxLength: 500 }),
    validateGoodsIssueDetailsArray()
];

export const goodsIssueUpdateValidation = [
    validateUUID('advisorId'),
    validateUUID('clientId'),
    validateUUID('departmentId'),
    validateUUID('requesterId'),
    validateProjectNumber('projectNumber'),
    validateDate('requestDate'),
    validateTextOptional({ fieldName: 'observations', maxLength: 500 }),
    validateGoodsIssueDetailsArray({ allowDetailId: true })
];

export const goodsIssueDetailsValidation = [
    validateGoodsIssueDetailsEdition
];