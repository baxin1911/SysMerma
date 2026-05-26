import { apiRequest } from "../axiosInstanceApi.js";

export const PROFILES_API_ROUTE = '/api/admin/profiles/';

export const getAllProfilesRequest = (params) => apiRequest({
    method: 'get',
    url: `${ PROFILES_API_ROUTE }`,
    params
});

export const registerProfileRequest = (profileData) => apiRequest({
    method: 'post',
    url: `${ PROFILES_API_ROUTE }`,
    data: profileData
});

export const updateProfileRequest = (profileId, profileData) => apiRequest({
    method: 'put',
    url: `${ PROFILES_API_ROUTE }${ profileId }/`,
    data: profileData
});