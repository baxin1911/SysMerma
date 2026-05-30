import { getAllRolesRequest } from "../../services/admin/roleService.js";

export const getAllRoles = async (params = {}) => {
    const response = await getAllRolesRequest({ params });
    return response.data;
};
