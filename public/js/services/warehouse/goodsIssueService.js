import { apiRequest } from "../axiosInstanceApi.js";

export const GOODS_ISSUES_API_ROUTE = '/api/warehouse/goods-issues';

export const getAllGoodsIssuesRequest = (params) => apiRequest({
    method: 'get',
    url: GOODS_ISSUES_API_ROUTE,
    params
});

export const registerGoodsIssueRequest = (data) => apiRequest({
    method: 'post',
    url: GOODS_ISSUES_API_ROUTE,
    data
});

export const editGoodsIssueRequest = (data, id) => apiRequest({
    method: 'patch',
    url: `${ GOODS_ISSUES_API_ROUTE }/${ id }`,
    data
});

export const editGoodsIssueDetailsRequest = (data, id) => apiRequest({
    method: 'patch',
    url: `${ GOODS_ISSUES_API_ROUTE }/${ id }/details`,
    data
});