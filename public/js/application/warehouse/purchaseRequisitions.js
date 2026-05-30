import { getErrorMessage, getSuccessMessage } from "../../constants/apiMessages.js";
import {
    cancelPurchaseRequisitionRequest,
    confirmPurchaseRequisitionRequest,
    editPurchaseRequisitionRequest,
    registerPurchaseRequisitionRequest
} from "../../services/warehouse/purchaseRequisitionService.js";

export const registerPurchaseRequisition = async ({ formData }) => {

    const response = await registerPurchaseRequisitionRequest({ data: formData });

    const { data } = response;
    const { code } = data;
    const message = getSuccessMessage(code);

    return {
        message
    };
};

export const editPurchaseRequisition = async ({ formData, id }) => {

    const response = await editPurchaseRequisitionRequest({ data: formData, id });

    const { data } = response;
    const { code } = data;
    const message = getSuccessMessage(code);

    return {
        message
    };
};

export const confirmPurchaseRequisition = async (id) => {

    const response = await confirmPurchaseRequisitionRequest({ id });
    const { code } = response.data;

    return {
        message: getSuccessMessage(code)
    };
};

export const cancelPurchaseRequisition = async (id) => {

    const response = await cancelPurchaseRequisitionRequest({ id });
    const { code } = response.data;

    return {
        message: getSuccessMessage(code)
    };
};
