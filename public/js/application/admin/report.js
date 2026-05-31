import { exportMovementReportRequest } from "../../services/admin/reportService.js";

export const exportMovementReport = async (params = {}) => {

    const response = await exportMovementReportRequest(params);

    return response.data;
}