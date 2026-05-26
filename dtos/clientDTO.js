export const createClientDtoForRegister = (body = {}) => ({
    name: body.name.trim(),
});