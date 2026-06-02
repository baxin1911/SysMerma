import { UnitMeasureNotFound } from "../../errors/warehouse/unitMeasureError.js";
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
        },
        select: {
            id: true,
            name: true,
            symbol: true
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

const DEFAULT_UNIT_MEASURE_SELECT = {
    id: true
};

export const findUniqueUnitMeasure = async ({
    tx,
    id
}) => {

    const db = getDb(tx);
    const unit = await db.unitMeasure.findUnique({
        where: { id },
        select: DEFAULT_UNIT_MEASURE_SELECT
    });

    if (!unit) throw new UnitMeasureNotFound();

    return unit;
}