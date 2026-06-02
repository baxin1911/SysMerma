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
        },
        select: {
            id: true,
            name: true
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

const DEFAULT_PRESENTATION_SELECT = {
    id: true
};

export const findUniquePresentation = async ({
    tx,
    id
}) => {

    const db = getDb(tx);
    const presentation = await db.presentation.findUnique({
        where: { id },
        select: DEFAULT_PRESENTATION_SELECT
    });

    if (!presentation) throw new PresentationNotFound();

    return presentation;
}