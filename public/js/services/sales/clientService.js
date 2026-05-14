import { apiRequest } from "../axiosInstanceApi.js";

export const CLIENTS_API_ROUTE = '/api/sales/clients/';

export const getAllClientsRequest = (params) => apiRequest({
    method: 'get',
    url: `${ CLIENTS_API_ROUTE }`,
    params
});