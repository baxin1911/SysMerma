import { apiRequest } from "../axiosInstanceApi.js";

export const CLIENTS_API_ROUTE = '/api/sales/clients';

export const getAllClientsRequest = ({ params }) => apiRequest({
    method: 'get',
    url: `${ CLIENTS_API_ROUTE }`,
    params
});

export const createClientRequest = ({ data }) => apiRequest({
    method: 'post',
    url: `${ CLIENTS_API_ROUTE }`,
    data
});

export const editClientRequest = ({ data, id }) => apiRequest({
    method: 'put',
    url: `${ CLIENTS_API_ROUTE }/${ id }`,
    data
});