import { apiRequest } from "../axiosInstanceApi.js";

export const FULFILLMENT_STATUSES_API_ROUTE = '/api/warehouse/fulfillment-statuses';

export const getAllFulfillmentStatusesRequest = ({ params }) => apiRequest({
    method: 'get',
    url: FULFILLMENT_STATUSES_API_ROUTE,
    params
});
