import { apiRequest } from "../axiosInstanceApi.js";

export const REPORTS_API_ROUTE = '/api/admin/reports';

export const exportMovementReportRequest = (params) => apiRequest({
    method: 'get',
    url: `${ REPORTS_API_ROUTE }/movements/excel`,
    responseType: 'blob',
    params
});