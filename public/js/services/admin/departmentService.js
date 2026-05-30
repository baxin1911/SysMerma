import { apiRequest } from "../axiosInstanceApi.js";

export const DEPARTMENTS_API_ROUTE = '/api/admin/departments/';

export const getAllDepartmentsRequest = ({ params }) => apiRequest({
    method: 'get',
    url: `${ DEPARTMENTS_API_ROUTE }`,
    params
});