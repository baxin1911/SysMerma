export const createProfileDTO = (body = {}) => ({

    fullName: body.fullName,
    departmentIds: body.departmentIds
});