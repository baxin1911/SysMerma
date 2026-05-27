import { getSuccessMessage } from "../../constants/apiMessages.js";
import { createClientRequest, editClientRequest, getAllClientsRequest } from "../../services/sales/clientService.js";

export const getAllClients = async (params = {}) => {

    const response = await getAllClientsRequest(params);

    return response;
};

export const registerClient = async (formData) => {

    const response = await createClientRequest(formData);

    const { data } = response;
    const { code, client } = data;
    let message = getSuccessMessage(code);

    return { 
        message, 
        data: client 
    };
}

export const editClient = async (formData, id) => {

    const response = await editClientRequest(formData, id);

    const { data } = response;
    const { code, client } = data;
    let message = getSuccessMessage(code);

    return { 
        message, 
        data: client 
    };
}