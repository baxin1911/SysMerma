import { getErrorMessage, getSuccessMessage } from "../../constants/apiMessages.js";
import { editSupplierRequest, getAllSuppliersRequest, registerSupplierRequest } from "../../services/warehouse/supplierService.js";

export const getSupplierOptions = async (params = {}) => {

    const response = await getAllSuppliersRequest({ params });

    const list = response.data?.data || [];

    return list.filter(supplier => supplier?.id && supplier?.tradeName)
        .map(supplier => ({
            value: supplier.id,
            label: supplier.tradeName
        }));
}

export const getAllSuppliers = async (params = {}) => {

    const response = await getAllSuppliersRequest({ params });

    return response;
};

export const registerSupplier = async ({ formData }) => {

    const response = await registerSupplierRequest({ data: formData });

    const { data } = response;
    const { code, supplier } = data;
    let message = getSuccessMessage(code);

    return {
        data: supplier,
        message
    };
}

export const editSupplier = async ({ formData, id }) => {

    const response = await editSupplierRequest({ data: formData, id });

    const { data } = response;
    const { code } = data;
    let message = getSuccessMessage(code);

    return {
        message
    };
}