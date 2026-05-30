import { apiRequest } from '../axiosInstanceApi.js';

export const ROLES_API_ROUTE = '/api/admin/roles/';

export const getAllRolesRequest = ({ params }) => apiRequest({
    method: 'get',
    url: ROLES_API_ROUTE,
    params
});
