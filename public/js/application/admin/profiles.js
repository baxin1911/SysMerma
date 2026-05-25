import { getAllProfilesRequest } from "../../services/admin/profileService.js";

export const getAllProfiles = async (params = {}) => {
    const response = await getAllProfilesRequest(params);
    return response.data;
};
