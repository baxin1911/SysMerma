import { body } from "express-validator";
import { errorMap } from "../../messages/codeMessages.js";
import { canAdjustProductStock } from "../../utils/permissionsUtils.js";
import { validateBoolean, validateNumber, validateNumberOptional, validateText, validateTextOptional, validateUUID } from "../fields/fieldsValidator.js";

const canValidateInitialStock = (req) => canAdjustProductStock(req.user) && req.body.newStock !== undefined && req.body.newStock !== '';

const validateInitialStock = body('newStock')
    .if((value, { req }) => canValidateInitialStock(req))
    .isFloat({ min: 0 }).withMessage(errorMap.newStock.INVALID_NUMBER)
    .matches(/^\d{1,8}(\.\d{1,2})?$/).withMessage(errorMap.newStock.TOO_LONG)
    .toFloat();

const validateInitialStockReason = body('reasonId')
    .if((value, { req }) => canAdjustProductStock(req.user) && Number(req.body.newStock) > 0)
    .notEmpty().withMessage(errorMap.reasonId.REQUIRED)
    .isUUID('4').withMessage(errorMap.reasonId.INVALID_UUID);

const validateInitialStockObservations = body('observations')
    .if((value, { req }) => canValidateInitialStock(req))
    .trim()
    .if(body('observations').notEmpty())
    .isString().withMessage(errorMap.observations.INVALID_TYPE)
    .isLength({ max: 500 }).withMessage(errorMap.observations.TOO_LONG(500))
    .matches(/^[^<>\\{}[\]]+$/u).withMessage(errorMap.name.INVALID_FORMAT);

export const productValidation = [
    validateText({ fieldName: 'name', maxLength: 200 }),
    validateUUID('supplierId'),
    validateUUID('presentationId'),
    validateUUID('unitMeasureId'),
    validateNumberOptional('minStock', { disableTooLong: true }),
    validateNumberOptional('base'),
    validateNumberOptional('height'),
    validateBoolean('isActive'),
    validateInitialStock,
    validateInitialStockReason,
    validateInitialStockObservations,
]

export const productStockValidation = [
    validateUUID('supplierId'),
    validateNumber('newStock'),
    validateTextOptional({ fieldName: 'observations', maxLength: 500 }),
    validateUUID('reasonId'),
]
