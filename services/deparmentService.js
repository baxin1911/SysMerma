import { getDb } from "../repository/baseRepository.js";

export const findAllDepartments = async ({
    skip = 0,
    take = 10,
    search = '',
    orderBy = 'name',
    orderDir = 'asc'
}) => {

    const where = {
        ...(search && {
            name: {
                contains: search,
                mode: 'insensitive'
            }
        })
    };

    const departments = await getDb().department.findMany({
        skip,
        take,
        where,
        orderBy: {
            [orderBy]: orderDir
        }
    });

    const total = await getDb().department.count();
    const filtered = await getDb().department.count({ where });

    return {
        data: departments,
        recordsTotal: total,
        recordsFiltered: filtered
    };
}