import { apiRequest } from "../axiosInstanceApi.js";

export const exportWarehouseReportRequest = async () =>
    apiRequest({
        method: 'get',
        url: '/api/warehouse/reports/inventory/excel',
        responseType: 'blob'
    });
