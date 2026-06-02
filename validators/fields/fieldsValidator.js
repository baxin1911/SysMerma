import { body } from "express-validator";
import { errorMap } from "../../messages/codeMessages.js";

const numberRegex = /\d/;
const UppercaseRegex = /[A-Z]/;
const whitespaceRegex = /^\S+$/;
const usernameRegex = /^[a-zA-Z0-9_]+$/;
const invoiceRegex = /^[a-zA-Z0-9\-]+$/;
const passwordRegex = /^[A-Za-z0-9!@#\$%\^&\*]+$/;
const nameRegex = /^[\p{L}0-9]+(?:[ '\-.,:;()¿?¡!][\p{L}0-9]+)*[.,:;()¿?¡!]*$/u;
const genericRegex = /^[^<>\\{}[\]]+$/u;
const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const validateUsername = 
    body('name')
        .trim()
        .notEmpty().withMessage(errorMap['username'].REQUIRED)
        .isString().withMessage(errorMap['username'].INVALID_TYPE)
        .isLength({ max: 50 }).withMessage(errorMap['username'].TOO_LONG)
        .matches(whitespaceRegex).withMessage(errorMap['username'].NO_SPACES)
        .matches(usernameRegex).withMessage(errorMap['username'].INVALID_FORMAT)
;

export const validatePassword = 
    body('password')
        .notEmpty().withMessage(errorMap['password'].REQUIRED)
        .isString().withMessage(errorMap['password'].INVALID_TYPE)
        .isLength({ min: 6 }).withMessage(errorMap['password'].TOO_SHORT)
        .isLength({ max: 50 }).withMessage(errorMap['password'].TOO_LONG)
        .matches(UppercaseRegex).withMessage(errorMap['password'].NEEDS_UPPERCASE)
        .matches(numberRegex).withMessage(errorMap['password'].NEEDS_NUMBER)
        .matches(passwordRegex).withMessage(errorMap['password'].INVALID_FORMAT)
;

export const validateName = ({ fieldName = 'name', maxLength = 50 }) => 
    body(fieldName)
        .trim()
        .notEmpty().withMessage(errorMap['name'].REQUIRED)
        .isString().withMessage(errorMap['name'].INVALID_TYPE)
        .isLength({ max: maxLength }).withMessage(errorMap['name'].TOO_LONG(maxLength))
        .matches(nameRegex).withMessage(errorMap['name'].INVALID_FORMAT)
;

export const validateInvoice = (maxLength = 50) =>
    body('invoice')
        .if((value, { req }) => {
            const val = req.body.isInvoiced;
            return val === true || val === 'true'
        })
        .notEmpty().withMessage(errorMap['invoice'].REQUIRED)
        .isString().withMessage(errorMap['invoice'].INVALID_TYPE)
        .isLength({ max: maxLength }).withMessage(errorMap['invoice'].TOO_LONG(maxLength))
        .matches(invoiceRegex).withMessage(errorMap['invoice'].INVALID_FORMAT)
;

export const validateText = ({ fieldName, maxLength }) =>
    body(fieldName)
        .trim()
        .notEmpty().withMessage(errorMap['name'].REQUIRED)
        .isString().withMessage(errorMap['name'].INVALID_TYPE)
        .isLength({ max: maxLength }).withMessage(errorMap['name'].TOO_LONG(maxLength))
        .matches(genericRegex).withMessage(errorMap['name'].INVALID_FORMAT)
;

export const validateTextOptional = ({ fieldName, maxLength }) => {

    const errors = errorMap[fieldName];

    return body(fieldName)
        .trim()
        .if(body(fieldName).notEmpty())
        .isString().withMessage(errors.INVALID_TYPE)
        .isLength({ max: maxLength }).withMessage(errors.TOO_LONG(maxLength))
        .matches(genericRegex).withMessage(errors.INVALID_FORMAT)
}

export const validateBoolean = (fieldName) =>
    body(fieldName)
        .exists().withMessage(errorMap[fieldName].REQUIRED)
        .isBoolean().withMessage(errorMap[fieldName].INVALID_BOOLEAN)
        .toBoolean()
;

export const validateUUID = (fieldName) => {

    const errors = errorMap[fieldName];

    return body(fieldName)
        .notEmpty().withMessage(errors.REQUIRED)
        .isUUID('4').withMessage(errors.INVALID_UUID)
}


export const validateProjectNumber = (fieldName) => {

    const errors = errorMap[fieldName];

    return body(fieldName)
        .trim()
        .notEmpty().withMessage(errors.REQUIRED)
        .isString().withMessage(errors.INVALID_TYPE)
        .isLength({ max: 10 }).withMessage(errors.TOO_LONG)
}

export const validateNumber = (fieldName) => {

    const errors = errorMap[fieldName];

    return body(fieldName)
        .notEmpty().withMessage(errors.REQUIRED)
        .isFloat().withMessage(errors.INVALID_NUMBER)
        .matches(/^\d{1,8}(\.\d{1,2})?$/).withMessage(errors.TOO_LONG)
        .toFloat()
}

export const validateNumberOptional = (fieldName, { disableTooLong = false } = {}) => {

    const errors = errorMap[fieldName];

    return body(fieldName)
        .if(body(fieldName).notEmpty())
        .notEmpty().withMessage(errors.REQUIRED)
        .isFloat().withMessage(errors.INVALID_NUMBER)
        .if(() => !disableTooLong)
        .matches(/^\d{1,7}(\.\d{1,3})?$/).withMessage(errors.TOO_LONG)
        .toFloat()
}

export const validateDate = (fieldName) => {

    const errors = errorMap[fieldName];

    return body(fieldName)
        .notEmpty().withMessage(errors.REQUIRED)
        .isISO8601().withMessage(errors.INVALID_FORMAT)
        .custom(value => !isNaN(new Date(value))).withMessage(errors.INVALID_FORMAT)
        .toDate()
}

export const validateDateOptional = (fieldName) => {

    const errors = errorMap[fieldName];

    return body(fieldName)
        .if(body(fieldName).notEmpty())
        .isISO8601().withMessage(errors.INVALID_FORMAT)
        .custom(value => !isNaN(new Date(value))).withMessage(errors.INVALID_FORMAT)
        .toDate()
}

export const validateDetailsArray = 
    body('details')
        .isArray({ min: 1 }).withMessage(errorMap['details'].REQUIRED)
        .custom(details => {

            details.forEach(detail => {

                if (!detail.productId || !detail.quantity || !detail.costPerUnitType) {
                    throw new Error(errorMap['details'].INVALID_FORMAT_REQUIRED);
                }

                const qty = Number(detail.quantity);
                const costPerUnitType = Number(detail.costPerUnitType);

                if (!Number.isFinite(qty) || qty < 1) throw new Error(errorMap['details'].INVALID_FORMAT_QUANTITY);
                if (!Number.isFinite(costPerUnitType) || costPerUnitType <= 0) throw new Error(errorMap['details'].INVALID_FORMAT_UNIT_COST_BY_QUANTITY);
            });

            return true;
        })
;

export const validateGoodsIssueDetailsArray = ({ allowDetailId = false } = {}) =>
    body('details')
        .isArray({ min: 1 }).withMessage(errorMap['details'].REQUIRED)
        .custom(details => {

            const ids = new Set();

            details.forEach(detail => {

                if (detail.id) {
                    if (!allowDetailId || !uuidV4Regex.test(detail.id)) {
                        throw new Error(errorMap['details'].INVALID_FORMAT_ID);
                    }

                    if (ids.has(detail.id)) {
                        throw new Error(errorMap['details'].INVALID_FORMAT_ID);
                    }

                    ids.add(detail.id);
                }

                if (!detail.productId || !detail.quantity) {
                    throw new Error(errorMap['details'].INVALID_FORMAT_REQUIRED);
                }

                if (!detail.supplierId) {
                    throw new Error(errorMap['details'].INVALID_FORMAT_SUPPLIER);
                }

                const qty = Number(detail.quantity);

                if (!Number.isFinite(qty) || qty < 1) throw new Error(errorMap['details'].INVALID_FORMAT_QUANTITY);
            });

            return true;
        })
;

export const validateGoodsIssueDetailsEdition =
    body('details')
        .isArray({ min: 1 }).withMessage(errorMap['details'].REQUIRED)
        .custom((details) => {

            const errors = {};

            details.forEach((detail) => {

                const detailId = detail?.id;
                
                if (!detailId || !uuidV4Regex.test(detailId)) {

                    if (!errors[detailId || 'details']) errors[detailId || 'details'] = {};

                    errors[detailId || 'details'].id = errorMap['details'].INVALID_FORMAT_ID;
                    return;
                }

                const quantity = Number(detail?.projectConvertedQuantity);
                const isSuppliedRaw = detail?.isSupplied;
                const isSupplied = typeof isSuppliedRaw === 'string'
                    ? isSuppliedRaw.toLowerCase() === 'true'
                    : isSuppliedRaw;

                if (!quantity) {

                    if (!errors[detailId]) errors[detailId] = {};

                    errors[detailId].projectConvertedQuantity = errorMap['details'].REQUIRED_QUANTITY;
                }

                if (!Number.isFinite(quantity) || quantity < 0) {

                    if (!errors[detailId]) errors[detailId] = {};

                    errors[detailId].projectConvertedQuantity = errorMap['details'].INVALID_FORMAT_QUANTITY;
                }

                if (isSuppliedRaw === null || isSuppliedRaw === undefined) {

                    if (!errors[detailId]) errors[detailId] = {};

                    errors[detailId].isSupplied = errorMap['isSupplied'].REQUIRED;
                }

                if (typeof isSupplied !== 'boolean') {

                    if (!errors[detailId]) errors[detailId] = {};

                    errors[detailId].isSupplied = errorMap['isSupplied'].INVALID_BOOLEAN;
                }

            });

            if (Object.keys(errors).length) {
                throw new Error(JSON.stringify(errors));
            }

            return true;
        })
;

export const validateArrayOfUUIDs = ({ fieldName }) =>
    body(fieldName)
        .isArray({ min: 1 }).withMessage(errorMap[fieldName].REQUIRED)
        .custom(
            arr => Array.isArray(arr) && arr.every(
                id => uuidV4Regex.test(id)
            )
        ).withMessage(errorMap[fieldName].INVALID_FORMAT)
;