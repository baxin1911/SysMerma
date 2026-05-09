import { DepartmentFindDatabaseError, DepartmentNotFound } from "../../errors/admin/departmentError.js";
import { getDb } from "../../repository/baseRepository.js";

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
