import { getErrorMessage } from "../constants/apiMessages.js";

export const normalizeHttpError = (err) => {

    if (!err.response) return {
        status: 0,
        data: null,
        message: 'No fue posible conectar con el servidor.',
        raw: err
    };

    const { status, data } = err.response;

    return {
        status,
        data,
        message: getErrorMessage(data),
        raw: err
    };
};