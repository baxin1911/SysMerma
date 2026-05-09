import { getErrorMessage, getSuccessMessage } from "../../constants/apiMessages.js";
import {
    registerGoodsReceiptRequest
} from "../../services/warehouse/goodsReceiptService.js";

export const registerGoodsReceipt = async (formData) => {

    const response = await registerGoodsReceiptRequest(formData);

    const { data } = response;
    const { code } = data;
    let message = getSuccessMessage(code);

    return {
        message
    };
}
