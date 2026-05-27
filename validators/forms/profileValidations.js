import { validateArrayOfUUIDs, validateName } from "../fields/fieldsValidator.js";

export const profileValidation = [
    validateName({ fieldName: 'fullName', maxLength: 255 }),
    validateArrayOfUUIDs({ fieldName: 'departments' })
]