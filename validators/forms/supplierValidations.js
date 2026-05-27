import { validateBoolean, validateText } from "../fields/fieldsValidator.js";

export const supplierValidation = [
    validateText({ fieldName: 'legalName', maxLength: 200, regex: /^[^<>\\{}[\]]+$/u }),
    validateText({ fieldName: 'tradeName', maxLength: 100, regex: /^[^<>\\{}[\]]+$/u }),
    validateBoolean('isActive')
]
