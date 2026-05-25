import { getDb } from "../../repository/baseRepository.js";

export const findAllReasons = async ({
    skip = 0,
    take = 10,
    search = '',
    orderBy = 'name',
    orderDir = 'asc'
}) => {

    const where = search
        ? {
            name: {
                contains: search,
                mode: 'insensitive'
            }
        }
        : {};

    const reasons = await getDb().stockAdjustmentReason.findMany({
        skip,
        take,
        where,
        orderBy: {
            [orderBy]: orderDir
        }
    });

    const total = await getDb().stockAdjustmentReason.count();
    const filtered = await getDb().stockAdjustmentReason.count({ where });

    return {
        data: reasons,
        recordsTotal: total,
        recordsFiltered: filtered
    };
}