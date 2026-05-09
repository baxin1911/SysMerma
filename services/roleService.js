import { getDb } from "../repository/baseRepository.js";

export const getRoleNameById = async (id) => {

    const role = await getDb().role.findFirst({
        where: {
            id: id
        },
    });

    return role ? role.name : null;
}