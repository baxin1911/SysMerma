import { getSuccessMessage } from "../../constants/apiMessages.js";
import { getAllProfilesRequest, registerProfileRequest, updateProfileRequest } from "../../services/admin/profileService.js";

export const getAllProfiles = async (params = {}) => {

    const response = await getAllProfilesRequest(params);
    
    return response;
};

export const registerProfile = async (formData) => {

    const response = await registerProfileRequest(formData);

    const { data } = response;
    const { code, profile } = data;
    let message = getSuccessMessage(code);

    return {
        message,
        data: profile
    };
}

export const updateProfile = async (formData, id) => {

    const response = await updateProfileRequest(formData, id);

    const { data } = response;
    const { code, profile } = data;
    let message = getSuccessMessage(code);

    return {
        message,
        data: profile
    };
}