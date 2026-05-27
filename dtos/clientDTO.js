export const createClientDto = (body = {}) => ({
    name: body.name.trim(),
});