import { getErrorMessage, getSuccessMessage } from "../../constants/apiMessages.js";
import { editProductRequest, editProductStockRequest, getAllProductsRequest, registerProductRequest } from "../../services/warehouse/productService.js";

export const getAllProducts = async (params = {}) => {

    const response = await getAllProductsRequest(params);

    return response;
};

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

export const editProductStock = async (formData, id) => {

    const response = await editProductStockRequest(formData, id);

    const { data } = response;
    const { code } = data;
    let message = getSuccessMessage(code);

    return {
        message
    };
}