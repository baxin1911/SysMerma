import { DepartmentFindDatabaseError, DepartmentNotFound } from "../../errors/admin/departmentError.js";
import { getDb } from "../../repository/baseRepository.js";

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

    const db = getDb();

    const departments = await db.department.findMany({
        skip,
        take,
        where,
        orderBy: {
            [orderBy]: orderDir
        }
    });

    const total = await db.department.count();
    const filtered = await db.department.count({ where });

    return {
        data: departments,
        recordsTotal: total,
        recordsFiltered: filtered
    };
}

export const findDepartmentById = async ({ tx, id }) => {

    const db = getDb(tx);
    let department;

    try {

        department = await db.department.findFirst({
            where: { id },
        });

    } catch (err) {

        throw new DepartmentFindDatabaseError();
    }

    if (!department) throw new DepartmentNotFound();

    return department || null;
}
