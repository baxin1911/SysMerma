export const createClientDtoForRegister = (body = {}) => ({
    name: body.name.trim(),
    advisorId: body.advisorId.trim()
});