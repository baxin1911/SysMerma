import { getSuccessMessage } from "../../constants/apiMessages.js";
import { editUserPasswordRequest, editUserRequest, getAllUsersRequest, registerUserRequest } from "../../services/admin/userService.js";

export const getAllUsers = async (params = {}) => {

    const response = await getAllUsersRequest(params);

    return response;
};

export const registerUser = async (formData) => {

    const response = await registerUserRequest(formData);

    const { data } = response;
    const { code, user } = data;
    const message = getSuccessMessage(code);

    return {
        message,
        data: user
    };
};

export const editUser = async (formData, id) => {

    const response = await editUserRequest(formData, id);

    const { data } = response;
    const { code, user } = data;
    const message = getSuccessMessage(code);

    return {
        message,
        data: user
    };
};

export const editUserPassword = async (formData, id) => {

    const response = await editUserPasswordRequest(formData, id);

    const { data } = response;
    const { code } = data;
    const message = getSuccessMessage(code);

    return { message };
};
