import { getErrorMessage, getSuccessMessage } from "../../constants/apiMessages.js";
import { editGoodsIssueDetailsRequest, editGoodsIssueRequest, registerGoodsIssueRequest } from "../../services/warehouse/goodsIssueService.js";

export const registerGoodsIssue = async (formData) => {

    const response = await registerGoodsIssueRequest(formData);

    const { data } = response;
    const { code } = data;
    let message = getSuccessMessage(code);

    return {
        message
    };
};

export const editGoodsIssue = async (formData, id) => {

    const response = await editGoodsIssueRequest(formData, id);

    const { data } = response;
    const { code } = data;
    let message = getSuccessMessage(code);

    return {
        message
    };
};

export const editGoodsIssueDetails = async (formData, id) => {

    const response = await editGoodsIssueDetailsRequest(formData, id);

    const { data } = response;
    const { code } = data;
    let message = getSuccessMessage(code);

    return {
        message
    };
};