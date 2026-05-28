import { exportMovementReportRequest } from "../../services/admin/reportService.js";

export const exportMovementReport = async () => {

    const response = await exportMovementReportRequest();

    return response.data;
}