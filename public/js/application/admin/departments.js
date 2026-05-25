import { getAllDepartmentsRequest } from "../../services/admin/departmentService.js";

export const getAllDepartments = async (params = {}) => {
    const response = await getAllDepartmentsRequest(params);
    return response.data;
};
