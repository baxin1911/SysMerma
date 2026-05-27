import { ProfileCreateDatabaseError, ProfileFindDatabaseError } from "../../errors/admin/profileError.js";
import { getDb } from "../../repository/baseRepository.js";
import { normalizeText } from "../../utils/formattersUtils.js";

export const findAllProfiles = async ({
    departments = [],
    includeDepartments = false,
    skip = 0,
    take = 10,
    search = '',
    orderBy = 'fullName',
    orderDir = 'asc'
}) => {

    const db = getDb();

    const where = {
        isActive: true,
        ...(search && {
            fullName: {
                contains: search,
                mode: 'insensitive'
            }
        }),
        ...(departments.length && {
            departments: {
                some: {
                    department: {
                        name: {
                            in: departments
                        }
                    }
                }
            }
        })
    };

    let profiles = await db.profile.findMany({
        skip,
        take,
        where,
        orderBy: {
            [orderBy]: orderDir
        },
        select: {
            id: true,
            fullName: true,
            ...(includeDepartments && {
                departments: {
                    select: {
                        department: true
                    }
                }
            })
        }
    });

    if (includeDepartments) profiles = profiles.map(profile => ({
        ...profile,
        departments: profile.departments.map(pd => pd.department)
    }));

    const total = await db.profile.count();
    const filtered = await db.profile.count({ where });

    return {
        data: profiles,
        recordsTotal: total,
        recordsFiltered: filtered
    };
};

export const findProfileById = async ({ tx, id }) => {

    const db = getDb(tx);
    let profile;

    try {

        profile = await db.profile.findUnique({
            where: {
                id,
                isActive: true
            },
            select: {
                id: true,
                fullName: true,
                departments: {
                    select: {
                        department: true
                    }
                }
            }
        });

    } catch (err) {

        throw new ProfileFindDatabaseError();
    }

    return profile || null;
};

export const profileBelongsToDepartment = ({ profile, departmentName }) => (
    profile?.departments?.some(({ department }) => (
        normalizeText(department?.name || '') === normalizeText(departmentName)
    ))
);

export const findProfileByUserId = async ({ tx, userId }) => {

    const db = getDb(tx);
    let profile;

    try {

        profile = await db.profile.findFirst({
            where: {
                isActive: true,
                users: {
                    some: {
                        id: userId
                    }
                }
            },
            select: {
                id: true,
            }
        });

    } catch (err) {

        throw new ProfileFindDatabaseError();
    }

    return profile?.id || null;
};


export const createProfile = async ({ profileDto }) => {

    const db = getDb();

    try {

        return await db.$transaction(async (tx) => {

            const profile = await tx.profile.create({
                data: {
                    fullName: profileDto.fullName,
                }
            });

            if (profileDto.departmentIds?.length) await tx.departmentProfile.createMany({
                data: profileDto.departmentIds.map(departmentId => ({
                    profileId: profile.id,
                    departmentId
                }))
            });

            return tx.profile.findUnique({
                where: {
                    id: profile.id
                },
                select: {
                    id: true,
                    fullName: true,
                    departments: {
                        select: {
                            department: true
                        }
                    }
                }
            });
        });

    } catch (err) {

        throw new ProfileCreateDatabaseError();
    }
}

export const updateProfile = async ({ profileDto, id }) => {

    const db = getDb();

    await findProfileById({ tx: db, id });

    try {
        return await db.$transaction(async (tx) => {

            await tx.profile.update({
                where: {
                    id
                },
                data: {
                    fullName: profileDto.fullName,
                }
            });

            await tx.departmentProfile.deleteMany({
                where: {
                    profileId: id
                }
            });

            if (profileDto.departments?.length) await tx.departmentProfile.createMany({
                data: profileDto.departments.map(departmentId => ({
                    profileId: id,
                    departmentId
                }))
            });

            return tx.profile.findUnique({
                where: {
                    id
                },
                select: {
                    id: true,
                    fullName: true,
                    departments: {
                        select: {
                            department: true
                        }
                    }
                }
            });
        });

    } catch (err) {

        throw new ProfileCreateDatabaseError();
    }
}