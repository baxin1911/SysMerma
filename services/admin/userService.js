import { UserCreateDatabaseError, UserFindDatabaseError, UserNotFound, UserUpdateDatabaseError } from "../../errors/admin/userError.js";
import { getDb } from "../../repository/baseRepository.js";
import { verifyPassword, encryptPassword } from "../../utils/encryptionUtils.js";

export const findAllUsers = async ({
    skip = 0,
    take = 10,
    search = '',
    orderBy = 'name',
    orderDir = 'asc'
}) => {

    const where = {
        isActive: true,
        ...(search && {
            name: {
                contains: search,
                mode: 'insensitive'
            }
        })
    };

    try {

        const db = getDb();

        const users = await db.user.findMany({
            skip,
            take,
            where,
            orderBy: {
                [orderBy]: orderDir
            },
            select: {
                id: true,
                name: true,
                profileId: true,
                profile: { select: { fullName: true } },
                accesses: {
                    select: { 
                        roleId: true, 
                        departmentId: true, 
                        role: { 
                            select: { 
                                name: true 
                            } 
                        }, 
                        department: { 
                            select: { 
                                name: true 
                            } 
                        } 
                    },
                    take: 1
                }
            }
        });

        const total = await db.user.count();
        const filtered = await db.user.count({ where });

        const data = users.map((user) => ({
            ...user,
            roleId: user.accesses?.[0]?.roleId || null,
            roleName: user.accesses?.[0]?.role?.name || null,
            departmentId: user.accesses?.[0]?.departmentId || null,
            departmentName: user.accesses?.[0]?.department?.name || null
        }));

        return { 
            data, 
            recordsTotal: total, 
            recordsFiltered: filtered 
        };

    } catch {
        throw new UserFindDatabaseError();
    }
};

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

    const isValid = await verifyPassword(password, user.password);

    if (isValid) return null;

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

export const createUser = async ({ userDto }) => {

    try {

        const db = getDb();

        const hashedPassword = await encryptPassword(userDto.password);

        return await db.user.create({
            data: {
                ...userDto,
                password: hashedPassword,
                accesses: {
                    create: {
                        role: { 
                            connect: { 
                                id: userDto.roleId 
                            } 
                        },
                        department: { 
                            connect: { 
                                id: userDto.departmentId 
                            } 
                        }
                    }
                }
            },
            select: { 
                id: true, 
                name: true, 
                profileId: true 
            }
        });

    } catch {

        throw new UserCreateDatabaseError();
    }
};

const assertUserExists = async ({ id }) => {

    const db = getDb();
    const user = await db.user.findUnique({ 
        where: { id }, 
        select: { id: true } 
    });

    if (!user) throw new UserNotFound();
};

export const updateUser = async ({ id, userDto }) => {

    try {
        await assertUserExists({ id });

        const db = getDb();

        return await db.$transaction(async (tx) => {
            const updated = await tx.user.update({
                where: { id },
                data: { 
                    name: userDto.name, 
                    profileId: userDto.profileId 
                },
                select: { 
                    id: true, 
                    name: true, 
                    profileId: true 
                }
            });

            await tx.userRoleDepartment.deleteMany({ 
                where: { 
                    userId: id 
                } 
            });
            await tx.userRoleDepartment.create({ 
                data: { 
                    userId: id, 
                    roleId: userDto.roleId, 
                    departmentId: userDto.departmentId 
                } 
            });

            return updated;
        });

    } catch (err) {

        if (err instanceof UserNotFound) throw err;

        throw new UserUpdateDatabaseError();
    }
};

export const updateUserPassword = async ({ id, userDto }) => {

    try {
        await assertUserExists({ id });

        const db = getDb();

        const hashedPassword = await encryptPassword(userDto.password);

        return await db.user.update({
            where: { id },
            data: { password: hashedPassword },
            select: { id: true }
        });

    } catch (err) {
console.log(err)
        if (err instanceof UserNotFound) throw err;

        throw new UserUpdateDatabaseError();
    }
};
