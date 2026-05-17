import { exportWarehouseReportRequest } from "../../services/warehouse/reportService.js";

export const exportWarehouseReport = async () => {

    const response = await exportWarehouseReportRequest();

    return response.data;
};
