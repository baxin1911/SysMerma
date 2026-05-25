import { getAllWastesRequest } from "../../services/warehouse/wasteService.js";

export const getAllWastes = async (params = {}) => {

    const response = await getAllWastesRequest(params);

    return response;
};
