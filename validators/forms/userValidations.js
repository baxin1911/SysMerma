import { validatePassword, validateUsername, validateUUID } from "../fields/fieldsValidator.js";

export const userValidation = [
    validateUsername,
    validatePassword,
    validateUUID('roleId'),
    validateUUID('departmentId')
];

export const userEditValidation = [
    validateUsername,
    validateUUID('roleId'),
    validateUUID('departmentId')
];

export const userPasswordValidation = [
    validatePassword
];
