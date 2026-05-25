import { getSuccessMessage } from "../../constants/apiMessages.js";
import { createClientRequest, getAllClientsRequest } from "../../services/sales/clientService.js";

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

export const getAllClients = async (params = {}) => {

    const response = await getAllClientsRequest(params);

    return response.data;
};
