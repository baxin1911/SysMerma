import { apiRequest } from '../axiosInstanceApi.js';

const USERS_API_ROUTE = '/api/admin/users';

export const getAllUsersRequest = ({ params }) => apiRequest({
    method: 'get',
    url: USERS_API_ROUTE,
    params
});

export const registerUserRequest = ({ data }) => apiRequest({
    method: 'post',
    url: USERS_API_ROUTE,
    data
});

export const editUserRequest = ({ data, id }) => apiRequest({
    method: 'patch',
    url: `${ USERS_API_ROUTE }/${ id }`,
    data
});

export const editUserPasswordRequest = ({ data, id }) => apiRequest({
    method: 'patch',
    url: `${ USERS_API_ROUTE }/${ id }/password`,
    data
});
