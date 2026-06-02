import { ProfileCreateDatabaseError, ProfileUpdateDatabaseError } from "../../errors/admin/profileError.js";
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

const DEFAULT_PROFILE_SELECT = {
    id: true,
    fullName: true
};

const PROFILE_WITH_DEPARTMENTS_SELECT = {
    ...DEFAULT_PROFILE_SELECT,
    departments: {
        select: {
            department: true
        }
    }
};

export const findProfileById = async ({ tx, id }) => {

    const db = getDb(tx);

    return db.profile.findUnique({
        where: {
            id,
            isActive: true
        },
        select: DEFAULT_PROFILE_SELECT
    });
};

export const findProfileWithDepartmentsById = async ({ tx, id }) => {

    const db = getDb(tx);

    return db.profile.findUnique({
        where: {
            id,
            isActive: true
        },
        select: PROFILE_WITH_DEPARTMENTS_SELECT
    });
};

export const profileBelongsToDepartment = ({ profile, departmentName }) => (
    profile?.departments?.some(({ department }) => (
        normalizeText(department?.name || '') === normalizeText(departmentName)
    ))
);

export const findProfileByUserId = async ({ tx, userId }) => {

    const db = getDb(tx);

    const profile = await db.profile.findFirst({
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

            if (profileDto.departments?.length) await tx.departmentProfile.createMany({
                data: profileDto.departments.map(departmentId => ({
                    profileId: profile.id,
                    departmentId
                }))
            });

            return tx.profile.findUnique({
                where: {
                    id: profile.id
                },
                select: PROFILE_WITH_DEPARTMENTS_SELECT
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
                select: PROFILE_WITH_DEPARTMENTS_SELECT
            });
        });

    } catch (err) {

        throw new ProfileUpdateDatabaseError();
    }
}
