import { getErrorMessage, getSuccessMessage } from "../../constants/apiMessages.js";
import { editProductRequest, editProductStockRequest, getAllProductsRequest, registerProductRequest } from "../../services/warehouse/productService.js";

export const getProductOptions = async (params = {}) => {

    const response = await getAllProductsRequest({ params });

    const list = response.data?.data || [];

    return list.filter(product => product?.id && product?.name)
        .map(p => {

            let text;

            if (!p.base || !p.height) text = `${ p.name } || ${ p.supplier.tradeName }`;
            else text = `${ p.name } (${ p.base } x ${ p.height }) || ${ p.supplier.tradeName }`;
            
            return {
                id: p.id,
                text: text
            }
        });
}

export const getAllProducts = async (params = {}) => {

    const response = await getAllProductsRequest({ params });

    return response;
};

export const registerProduct = async ({ formData }) => {

    const response = await registerProductRequest({ data: formData });

    const { data } = response;
    const { code, product } = data;
    let message = getSuccessMessage(code);

    return {
        message,
        data: product
    };
}

export const editProduct = async ({ formData, id }) => {

    const response = await editProductRequest({ data: formData, id });

    const { data } = response;
    const { code } = data;
    let message = getSuccessMessage(code);

    return {
        message
    };
}

export const editProductStock = async ({ formData, id }) => {

    const response = await editProductStockRequest({ data: formData, id });

    const { data } = response;
    const { code } = data;
    let message = getSuccessMessage(code);

    return {
        message
    };
}