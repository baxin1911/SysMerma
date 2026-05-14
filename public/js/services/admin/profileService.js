import { apiRequest } from "../axiosInstanceApi.js";

export const PROFILES_API_ROUTE = '/api/admin/profiles/';

export const getAllProfilesRequest = (params) => apiRequest({
    method: 'get',
    url: `${ PROFILES_API_ROUTE }`,
    params
});