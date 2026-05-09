import { PresentationFindDatabaseError, PresentationNotFound } from "../../errors/warehouse/presentationError.js";
import { getDb } from "../../repository/baseRepository.js";

export const findAllPresentations = async ({
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

    const presentations = await getDb().presentation.findMany({
        skip,
        take,
        where,
        orderBy: {
            [orderBy]: orderDir
        }
    });

    const total = await getDb().presentation.count();
    const filtered = await getDb().presentation.count({ where });

    return {
        data: presentations,
        recordsTotal: total,
        recordsFiltered: filtered
    };
}

export const findUniquePresentation = async ({
    tx,
    id
}) => {

    const db = getDb(tx);
    const presentation = await db.presentation.findUnique({
        where: { id },
        select: { id: true }
    });

    if (!presentation) throw new PresentationNotFound();

    return presentation;
}