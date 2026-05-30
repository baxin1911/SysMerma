import { getAllUnitMeasuresRequest } from "../../services/warehouse/unitMeasureService.js";

export const getAllUnitMeasures = async (params = {}) => {

    const response = await getAllUnitMeasuresRequest({ params });

    return response;
};
