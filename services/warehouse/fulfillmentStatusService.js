import { getDb } from "../../repository/baseRepository.js";

export const findAllFulfillmentStatuses = async ({
    skip = 0,
    take = 10,
    search = '',
    orderBy = 'name',
    orderDir = 'asc'
}) => {
    const db = getDb();

    const where = search
        ? {
            name: {
                contains: search,
                mode: 'insensitive'
            }
        }
        : {};

    const statuses = await db.fulfillmentStatus.findMany({
        skip,
        take,
        where,
        orderBy: {
            [orderBy]: orderDir
        },
        select: {
            id: true,
            name: true
        }
    });

    const total = await db.fulfillmentStatus.count();
    const filtered = await db.fulfillmentStatus.count({ where });

    return {
        data: statuses,
        recordsTotal: total,
        recordsFiltered: filtered
    };
};
