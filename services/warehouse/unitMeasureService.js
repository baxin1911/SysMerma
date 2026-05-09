import { UnitMeasureFindDatabaseError, UnitMeasureNotFound } from "../../errors/warehouse/unitMeasureError.js";
import { getDb } from "../../repository/baseRepository.js";

export const findAllUnitMeasures = async ({
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

    const units = await getDb().unitMeasure.findMany({
        skip,
        take,
        where,
        orderBy: {
            [orderBy]: orderDir
        }
    });

    const total = await getDb().unitMeasure.count();
    const filtered = await getDb().unitMeasure.count({ where });

    return {
        data: units,
        recordsTotal: total,
        recordsFiltered: filtered
    };
}

export const findUniqueUnitMeasure = async ({
    tx,
    id
}) => {

    const db = getDb(tx);
    const unit = await db.unitMeasure.findUnique({
        where: { id },
        select: { id: true }
    });

    if (!unit) throw new UnitMeasureNotFound();

    return unit;
}