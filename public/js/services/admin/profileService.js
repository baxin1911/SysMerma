import { apiRequest } from "../axiosInstanceApi.js";

export const PROFILES_API_ROUTE = '/api/admin/profiles';

export const getAllProfilesRequest = ({ params }) => apiRequest({
    method: 'get',
    url: `${ PROFILES_API_ROUTE }`,
    params
});

export const registerProfileRequest = ({ data }) => apiRequest({
    method: 'post',
    url: `${ PROFILES_API_ROUTE }`,
    data
});

export const updateProfileRequest = ({ data, id }) => apiRequest({
    method: 'put',
    url: `${ PROFILES_API_ROUTE }/${ id }/`,
    data
});