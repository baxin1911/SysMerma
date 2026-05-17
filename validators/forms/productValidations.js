import { validateBoolean, validateNumberOptional, validateText, validateUUID } from "../fields/fieldsValidator.js";

export const productValidation = [
    validateText({ fieldName: 'name', maxLength: 200, regex: /^[^<>\\{}[\]]+$/u }),
    validateUUID('supplierId'),
    validateUUID('presentationId'),
    validateUUID('unitMeasureId'),
    validateNumberOptional('minStock', { disableTooLong: true }),
    validateNumberOptional('base'),
    validateNumberOptional('height'),
    validateBoolean('isActive')
]
