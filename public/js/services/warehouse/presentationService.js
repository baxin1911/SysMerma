import { apiRequest } from "../axiosInstanceApi.js";

export const PRESENTATIONS_API_ROUTE = '/api/warehouse/presentations';

export const getAllPresentationsRequest = ({ params }) => apiRequest({
    method: 'get',
    url: PRESENTATIONS_API_ROUTE,
    params
});