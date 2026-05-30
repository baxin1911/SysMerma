import { getErrorMessage, getSuccessMessage } from "../../../constants/apiMessages.js";
import { editGoodsIssueDetailsRequest, editGoodsIssueRequest, getAllGoodsIssuesRequest, registerGoodsIssueRequest } from "../../../services/warehouse/goodsIssueService.js";

export const getAllGoodsIssues = async (params = {}) => {

    const response = await getAllGoodsIssuesRequest({ params });

    return response;
};

export const registerGoodsIssue = async ({ formData }) => {

    const response = await registerGoodsIssueRequest({ data: formData });

    const { data } = response;
    const { code } = data;
    let message = getSuccessMessage(code);

    return {
        message
    };
};

export const editGoodsIssue = async ({ formData, id }) => {

    const response = await editGoodsIssueRequest({ data: formData, id });

    const { data } = response;
    const { code } = data;
    let message = getSuccessMessage(code);

    return {
        message
    };
};

export const editGoodsIssueDetails = async ({ formData, id }) => {

    const response = await editGoodsIssueDetailsRequest({ data: formData, id });

    const { data } = response;
    const { code } = data;
    let message = getSuccessMessage(code);

    return {
        message
    };
};
