import { apiRequest } from "../axiosInstanceApi.js";

export const REASONS_API_ROUTE = '/api/warehouse/reasons';

export const getAllReasonsRequest = ({ params }) => apiRequest({
    method: 'get',
    url: REASONS_API_ROUTE,
    params
});