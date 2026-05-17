import { validateBoolean, validateText } from "../fields/fieldsValidator.js";

export const supplierValidation = [
    validateText({ fieldName: 'legalName', maxLength: 200 }),
    validateText({ fieldName: 'tradeName', maxLength: 100 }),
    validateBoolean('isActive')
]
