import { getAllMovementsRequest } from "../../services/admin/movementService.js";

export const getAllMovements = async (params = {}) => {

    const response = await getAllMovementsRequest({ params });
    
    return response;
};