import { validateBoolean, validateDate, validateDetailsArray, validateInvoice, validateTextOptional, validateUUID } from "../fields/fieldsValidator.js";

export const goodsReceiptValidation = [
    validateUUID('supplierId'),
    validateUUID('receivedById'),
    validateBoolean('isInvoiced'),
    validateInvoice(),
    validateDate('receptionDate'),
    validateTextOptional({ fieldName: 'observations', maxLength: 500 }),
    validateDetailsArray
]
