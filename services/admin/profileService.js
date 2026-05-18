import { ProfileFindDatabaseError } from "../../errors/admin/profileError.js";
import { getDb } from "../../repository/baseRepository.js";
import { normalizeText } from "../../utils/formattersUtils.js";

export const findAllProfiles = async ({
    departments = [],
    skip = 0,
    take = 10,
    search = '',
    orderBy = 'fullName',
    orderDir = 'asc'
}) => {

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

    const profiles = await getDb().profile.findMany({
        skip,
        take,
        where,
        orderBy: {
            [orderBy]: orderDir
        }
    });

    const total = await getDb().profile.count();
    const filtered = await getDb().profile.count({ where });

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
                        department: {
                            select: {
                                name: true
                            }
                        }
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
