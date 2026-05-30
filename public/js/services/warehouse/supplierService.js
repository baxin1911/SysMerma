import { apiRequest } from "../axiosInstanceApi.js";

export const SUPPLIERS_API_ROUTE = '/api/warehouse/suppliers';

export const getAllSuppliersRequest = ({ params }) => apiRequest({
    method: 'get',
    url: SUPPLIERS_API_ROUTE,
    params
});

export const registerSupplierRequest = ({ data }) => apiRequest({
    method: 'post',
    url: SUPPLIERS_API_ROUTE,
    data
});

export const editSupplierRequest = ({ data, id }) => apiRequest({
    method: 'put',
    url: `${ SUPPLIERS_API_ROUTE }/${ id }`,
    data
});