import { getDb } from "../repository/baseRepository.js";

export const getUserIdByLogin = async (name, password) => {

    const user = await getDb().user.findUnique({
        where: {
            name: name,
        },
        select: {
            id: true,
            password: true
        }
    });

    if (!user) return null;

    if (password !== user.password) return null;

    return user.id;
}

export const getLoggedUser = async (userId) => {

    const accesses = await getDb().userRoleDepartment.findMany({
        where: {
            userId
        },
        select: {
            user: true,
            role: true,
            department: true
        }
    });

    if (!accesses.length) return null;

    return {
        id: accesses[0].user.id,
        name: accesses[0].user.name,
        accesses: accesses.map(a => ({
            roleId: a.role.id,
            role: a.role.name,
            departmentId: a.department.id,
            department: a.department.name
        }))
    };
}
