export const createUserDtoForRegister = (body) => ({
    name: body.name,
    password: body.password,
    profileId: body.profileId,
    roleId: body.roleId,
    departmentId: body.departmentId,
});

export const createUserDtoForEdit = (body) => ({
    name: body.name,
    profileId: body.profileId,
    roleId: body.roleId,
    departmentId: body.departmentId,
});

export const createUserPasswordDtoForEdit = (body) => ({
    password: body.password,
});

export const createUserDtoForToken = (id) => ({

    id

});