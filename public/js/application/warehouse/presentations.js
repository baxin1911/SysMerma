import { getAllPresentationsRequest } from "../../services/warehouse/presentationService.js";

export const getAllPresentations = async (params = {}) => {

    const response = await getAllPresentationsRequest(params);
    
    return response;
};
