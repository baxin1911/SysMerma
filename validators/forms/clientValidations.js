import { validateText } from "../fields/fieldsValidator.js";

export const clientValidation = [
    validateText({ field: 'name', minLength: 1, maxLength: 255 }),
];