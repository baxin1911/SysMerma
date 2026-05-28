import { apiRequest } from "../axiosInstanceApi.js";

export const MOVEMENTS_API_ROUTE = '/api/admin/movements/';

export const getAllMovementsRequest = (params) => apiRequest({
    method: 'get',
    url: `${ MOVEMENTS_API_ROUTE }`,
    params
});