import { includeSpace, includeUppercase, isDate, isEmptyOrNull, isLengthInRangeMax, isLengthInRangeMin, isNegative, isNumber, isNumberphone, isString } from "./baseValidations.js";

export const validatePassword = (password) => {

    const allowedNumber = /\d/;
    const allowedPassword = /^[A-Za-z0-9!@#\$%\^&\*]+$/;
    const fieldName = 'La contraseña';
    let result = isEmptyOrNull(password, fieldName);

    if (result) return result;

    result = isString(password, fieldName);

    if (result) return result;

    result = includeUppercase(password, fieldName);

    if (result) return result;

    if (!allowedNumber.test(password)) return `${ fieldName } debe tener al menos un número.`;

    if (!allowedPassword.test(password)) return  `${ fieldName } debe tener al menos un símbolo especial.`;

    result = isLengthInRangeMin(password, 6, fieldName);

    if (result) return result;

    result = isLengthInRangeMax(password, 50, fieldName);

    return result;
}

export const validateUsername = (username) => {

    const allowedUsername = /^[a-zA-Z0-9_]+$/;
    const fieldName = 'El nombre de usuario';
    let result = isEmptyOrNull(username, fieldName);

    if (result) return result;

    result = isString(username, fieldName);

    if (result) return result;

    result = includeSpace(username, fieldName);

    if (result) return result;

    result = includeUppercase(username, fieldName);

    if (result) return result;

    if (!allowedUsername.test(username)) return `${ fieldName } debe tener solo letras, numeros y guiones bajos`;
    
    result = isLengthInRangeMax(username, 50, fieldName);

    return result;
}

export const validateNumber = (number, fieldName) => {

    let result = isEmptyOrNull(number, fieldName);

    if (result) return result;

    number = parseFloat(number);

    result = isNumber(number, fieldName);

    if (result) return result;

    result = isNegative(number, fieldName);

    return result;
}

export const validateNumberOptional = (number, fieldName) => {

    if (!number) return null;

    number = parseFloat(number);

    let result = isNumber(number, fieldName);

    if (result) return result;

    result = isNegative(number, fieldName);

    return result;
}

export const validateDate = (date, fieldName) => {

    let result = isEmptyOrNull(Date, fieldName);

    if (result) return result;

    result = isDate(date, fieldName);

    return result;
}

export const validateDateOptional = (date, fieldName) => {

    if (!date) return null;

    const result = isDate(date, fieldName);

    return result;
}

export const validateMeasure = (measure, fieldName) => {

    if (!measure) return null;

    let result = isEmptyOrNull(measure, fieldName);

    if (result) return result;

    measure = parseFloat(measure);

    result = isNumber(measure, fieldName);

    return result;
}

export const validateText = (name, length, fieldName) => {

    const allowedName = /^[\p{L}0-9]+(?:[ '\-.,:;()¿?¡!][\p{L}0-9]+)*[.,:;()¿?¡!]*$/u;
    let result = isEmptyOrNull(name, fieldName);

    if (result) return result;

    result = isString(name, fieldName);

    if (result) return result;

    if (!allowedName.test(name)) return `${ fieldName } debe tener solo letras, números, signos de puntuación o espacios.`;

    result = isLengthInRangeMax(name, length, fieldName);

    return result;
}

export const validateTextOptional = (name, length, fieldName) => {

    if (!name) return null;

    const result = validateText(name, length, fieldName);

    return result;
}

export const validateName = (name, length = 50) => validateText(name, length, 'El nombre');

export const validateGoodsReceiptDetailsArray = (details) => {

    if (!Array.isArray(details) || details.length === 0) {
        return 'La lista de detalles debe contener al menos un producto.';
    }

    for (const detail of details) {

        if (!detail.productId || !detail.quantity || !detail.costPerUnitType) {
            return 'Cada detalle debe contener producto, cantidad y costo por presentación.';
        }

        if (isNaN(detail.quantity) || parseFloat(detail.quantity) < 1) {
            return 'La cantidad de cada detalle debe ser un número mayor a cero.';
        }

        if (isNaN(detail.costPerUnitType) || parseFloat(detail.costPerUnitType) <= 0) {
            return 'El costo por presentación de cada detalle debe ser un número mayor a cero.';
        }
    }

    return null;
};

export const validateGoodsIssueDetailsArray = (details) => {

    if (!Array.isArray(details) || details.length === 0) {
        return 'La lista de detalles debe contener al menos un producto.';
    }

    for (const detail of details) {

        if (!detail.productId || !detail.quantity) {
            return 'Cada detalle debe contener producto y cantidad.';
        }

        if (isNaN(detail.quantity) || parseFloat(detail.quantity) < 1) {
            return 'La cantidad de cada detalle debe ser un número mayor a cero.';
        }

    }

    return null;
}
