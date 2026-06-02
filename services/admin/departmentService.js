import { DepartmentNotFound } from "../../errors/admin/departmentError.js";
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
        },
        select: {
            id: true,
            name: true
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

const DEFAULT_DEPARTMENT_SELECT = {
    id: true,
    name: true
};

export const findDepartmentById = async ({ tx, id }) => {

    const db = getDb(tx);
    const department = await db.department.findFirst({
        where: { id },
        select: DEFAULT_DEPARTMENT_SELECT
    });

    if (!department) throw new DepartmentNotFound();

    return department || null;
}
