import { getErrorMessage, getSuccessMessage } from "../../constants/apiMessages.js";
import { getAllGoodsReceiptsRequest, registerGoodsReceiptRequest } from "../../services/warehouse/goodsReceiptService.js";

export const getAllGoodsReceipts = async (params = {}) => {

    const response = await getAllGoodsReceiptsRequest(params);

    return response;
};

export const registerGoodsReceipt = async (formData) => {

    const response = await registerGoodsReceiptRequest(formData);

    const { data } = response;
    const { code } = data;
    let message = getSuccessMessage(code);

    return {
        message
    };
}