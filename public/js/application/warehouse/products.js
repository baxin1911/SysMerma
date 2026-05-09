import { getErrorMessage, getSuccessMessage } from "../../constants/apiMessages.js";
import { editProductRequest, registerProductRequest } from "../../services/warehouse/productService.js";

export const registerProduct = async (formData) => {

    const response = await registerProductRequest(formData);

    const { data } = response;
    const { code, product } = data;
    let message = getSuccessMessage(code);

    return {
        message,
        data: product
    };
}

export const editProduct = async (formData, id) => {

    const response = await editProductRequest(formData, id);

    const { data } = response;
    const { code } = data;
    let message = getSuccessMessage(code);

    return {
        message
    };
}