import { validatePassword, validateUsername, validateUUID } from "../fields/fieldsValidator.js";

export const userValidation = [
    validateUsername,
    validatePassword,
    validateUUID('profileId'),
    validateUUID('roleId'),
    validateUUID('departmentId')
];

export const userEditValidation = [
    validateUsername,
    validateUUID('profileId'),
    validateUUID('roleId'),
    validateUUID('departmentId')
];

export const userPasswordValidation = [
    validatePassword
];
