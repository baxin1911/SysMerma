import { apiRequest } from "../axiosInstanceApi.js";

export const UNIT_MEASURES_API_ROUTE = '/api/warehouse/unit-measures';

export const getAllUnitMeasuresRequest = ({ params }) => apiRequest({
    method: 'get',
    url: UNIT_MEASURES_API_ROUTE,
    params
});