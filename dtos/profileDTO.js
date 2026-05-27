export const createProfileDTO = (body = {}) => ({

    fullName: body.fullName,
    departments: body.departments
});