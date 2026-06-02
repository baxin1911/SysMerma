import { isEmptyOrNull } from "./baseValidations.js";
import { validateName, validatePassword, validateNumber, validateUsername, validateTextOptional, validateMeasure, validateDateOptional, validateGoodsReceiptDetailsArray, validateDate, validateText, validateNumberOptional, validateGoodsIssueDetailsArray, validatePositiveNumber } from "./fieldValidations.js";

export const supplierValidators = {
    legalName: (value) => validateText({ 
        name: value, 
        length: 200, 
        fieldName: 'La razón social' 
    }),
    tradeName: (value) => validateText({ 
        name: value, 
        length: 100, 
        fieldName: 'El nombre comercial' 
    }),
}

export const productValidators = {
    name: (value) => validateName(value, 200),
    supplierId: (value) => isEmptyOrNull(value, 'El proveedor'),
    presentationId: (value) => isEmptyOrNull(value, 'La presentación'),
    unitMeasureId: (value) => isEmptyOrNull(value, 'La unidad'),
    minStock: (value) => validateNumberOptional(value, 'El stock mínimo'),
    base: (value) => validateNumberOptional(value, 'La base'),
    height: (value) => validateNumberOptional(value, 'La altura'),
}

export const productStockValidators = {
    newStock: (value) => validateNumber(value, 'El nuevo stock'),
    reasonId: (value) => isEmptyOrNull(value, 'La razón de ajuste'),
    observations: (value) => validateTextOptional(value, 500, 'Las observaciones'),
}

export const loginValidators = {
    name: validateUsername,
    password: validatePassword,
}

export const validateAddGoodsReceiptProductValidators = {
    supplierId: (value) => isEmptyOrNull(value, 'El proveedor'),
    productId: (value) => isEmptyOrNull(value, 'El producto'),
    quantity: (value) => validatePositiveNumber(value, 'La cantidad'),
    costPerUnitType: (value) => validatePositiveNumber(value, 'El costo por presentación'),
}

export const validateAddProductValidators = {
    productId: (value) => isEmptyOrNull(value, 'El producto'),
    quantity: (value) => validatePositiveNumber(value, 'La cantidad'),
}

export const validateGoodsReceiptValidators = {
    receivedById: (value) => isEmptyOrNull(value, 'El recibidor'),
    supplierId: (value) => isEmptyOrNull(value, 'El proveedor'),
    observations: (value) => validateTextOptional(value, 500, 'Las observaciones'),
    receptionDate: (value) => validateDate(value, 'La fecha de recepción'),
    details: validateGoodsReceiptDetailsArray
}

export const validateGoodsIssueValidators = {
    projectNumber: (value) => validateText({ 
        name: value, 
        maxLength: 10, 
        fieldName: 'El número de proyecto' 
    }),
    advisorId: (value) => isEmptyOrNull(value, 'El asesor'),
    clientId: (value) => isEmptyOrNull(value, 'El cliente'),
    departmentId: (value) => isEmptyOrNull(value, 'El cliente'),
    requesterId: (value) => isEmptyOrNull(value, 'El solicitante'),
    observations: (value) => validateTextOptional(value, 500, 'Las observaciones'),
    requestDate: (value) => validateDate(value, 'La fecha de solicitud'),
    details: validateGoodsIssueDetailsArray
}

export const validateGoodsIssueDetailValidators = {
    projectConvertedQuantity: (value) => validateNumber(value, 'La cantidad')
}

export const validatePurchaseRequisitionValidators = {
    projectId: (value) => isEmptyOrNull(value, 'El proyecto'),
    observations: (value) => validateTextOptional(value, 500, 'Las observaciones'),
    requestDate: (value) => validateDate(value, 'La fecha de solicitud'),
    details: validateGoodsReceiptDetailsArray
};

export const validateClientValidators = {
    name: (value) => validateText({ 
        name: value, 
        length: 100, 
        fieldName: 'El nombre' 
    }),
}

export const userValidators = {
    name: validateUsername,
    password: validatePassword,
    departmentId: (value) => isEmptyOrNull(value, 'El área'),
    roleId: (value) => isEmptyOrNull(value, 'El rol')
};

export const userEditValidators = {
    name: validateUsername,
    departmentId: (value) => isEmptyOrNull(value, 'El área'),
    roleId: (value) => isEmptyOrNull(value, 'El rol')
};

export const userPasswordValidators = {
    password: validatePassword,
};

export const profileValidators = {
    fullName: (value) => validateText({ 
        name: value, 
        length: 100, 
        fieldName: 'El nombre', 
        regex: /^[\p{L}0-9]+(?:[ '\-.,:;()¿?¡!][\p{L}0-9]+)*[.,:;()¿?¡!]*$/u 
    }),
    departments: (value) => {

        if (!Array.isArray(value) || !value.length) return 'Seleccione al menos un departamento';

        const hasInvalid = value.some(department => isEmptyOrNull(department));

        if (hasInvalid) return 'Todos los departamentos seleccionados deben ser válidos';

        return null;
    },
}