import { validationResult } from 'express-validator';
import { errorMap } from '../messages/codeMessages.js';

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj ?? {}, key);
const isObject = (value) => typeof value === 'object' && value !== null;
const isErrorCodeObject = (error) => isObject(error) && hasOwn(error, 'code');
const getValidationErrorCode = (error) => hasOwn(error, 'msg') ? error.msg : null;
const hasErrorCode = (error) => Boolean(error?.code);

const normalizeValidationError = (error) => {

    if (Array.isArray(error)) return error.map(normalizeValidationError);

    if (isErrorCodeObject(error)) return hasErrorCode(error) ? error : null;

    if (isObject(error)) {

        const result = {};

        for (const key in error) {
            const normalizedError = normalizeValidationError(error[key]);

            if (normalizedError !== null) result[key] = normalizedError;
        }

        return Object.keys(result).length ? result : null;
    }

    return error ? { code: error } : null;
}

export const validate = (req, res, next) => {

    const errorsArray = validationResult(req).array();

    if (errorsArray.length > 0) {

        const errors = {};
        
        errorsArray.forEach(error => {
            const errorCode = getValidationErrorCode(error);

            if (error.path === 'details' && errorCode) {
                try {
                    const parsed = JSON.parse(errorCode);
                    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                        const normalizedDetailsErrors = normalizeValidationError(parsed);

                        if (normalizedDetailsErrors) Object.assign(errors, normalizedDetailsErrors);

                        return;
                    }
                } catch (_) {}
            }
            
            const normalizedError = normalizeValidationError(errorCode);

            if (normalizedError !== null) errors[error.path] = normalizedError;
        });

        return res.status(400).json({ errors, code: errorMap.message.VALIDATION_ERROR });
    }

    next();
}

export const validateLogin = (req, res, next) => {

    const errorsArray = validationResult(req).array();

    if (errorsArray.length > 0) return res.status(401).json({ code: errorMap.message.LOGIN_ERROR });

    next();
}