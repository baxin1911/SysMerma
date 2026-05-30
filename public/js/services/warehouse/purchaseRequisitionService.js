import { apiRequest } from "../axiosInstanceApi.js";

export const PURCHASE_REQUISITIONS_API_ROUTE = '/api/warehouse/purchase-requisitions';

export const registerPurchaseRequisitionRequest = ({ data }) => apiRequest({
    method: 'post',
    url: PURCHASE_REQUISITIONS_API_ROUTE,
    data
});

export const editPurchaseRequisitionRequest = ({ data, id }) => apiRequest({
    method: 'put',
    url: `${ PURCHASE_REQUISITIONS_API_ROUTE }/${ id }`,
    data
});

export const confirmPurchaseRequisitionRequest = ({ id }) => apiRequest({
    method: 'patch',
    url: `${ PURCHASE_REQUISITIONS_API_ROUTE }/${ id }/confirm`
});

export const cancelPurchaseRequisitionRequest = ({ id }) => apiRequest({
    method: 'patch',
    url: `${ PURCHASE_REQUISITIONS_API_ROUTE }/${ id }/cancel`
});
