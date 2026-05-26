import { getSuccessMessage } from "../../constants/apiMessages.js";
import { getAllProfilesRequest, registerProfileRequest, updateProfileRequest } from "../../services/admin/profileService.js";

export const getAllProfiles = async (params = {}) => {
    const response = await getAllProfilesRequest(params);
    return response.data;
};

export const registerProfile = async (profileData) => {

    const response = await registerProfileRequest(profileData);

    const { data } = response;
    const { code, profile } = data;
    let message = getSuccessMessage(code);

    return {
        message,
        data: profile
    };
}

export const updateProfile = async (profileId, profileData) => {

    const response = await updateProfileRequest(profileId, profileData);

    const { data } = response;
    const { code, profile } = data;
    let message = getSuccessMessage(code);

    return {
        message,
        data: profile
    };
}