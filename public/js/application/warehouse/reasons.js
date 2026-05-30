import { getAllReasonsRequest } from "../../services/warehouse/reasonService.js";

export const getAllReasons = async (params = {}) => {

    const response = await getAllReasonsRequest({ params });

    return response;
};
