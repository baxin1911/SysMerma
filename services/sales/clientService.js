import { ClientCreateDatabaseError, ClientFindDatabaseError, ClientNotFound } from "../../errors/sales/clientError.js";
import { getDb } from "../../repository/baseRepository.js";

export const findAllClients = async ({
    advisorId,
    skip = 0,
    take = 10,
    search = '',
    orderBy = 'name',
    orderDir = 'asc'
}) => {

    const where = {
        ...(advisorId && { advisorId: advisorId }),
        ...(search && {
            name: {
                contains: search,
                mode: 'insensitive'
            }
        })
    };

    const clients = await getDb().client.findMany({
        skip,
        take,
        where,
        orderBy: {
            [orderBy]: orderDir
        }
    });

    const total = await getDb().client.count();
    const filtered = await getDb().client.count({ where });

    return {
        data: clients,
        recordsTotal: total,
        recordsFiltered: filtered
    };
}

export const findClientById = async ({ tx = null, id }) => {

    const db = getDb(tx);
    let client;

    try {

        client = await db.client.findFirst({
            where: { id },
            select: {
                id: true,
                name: true
            }
        });

    } catch (err) {

        throw new ClientFindDatabaseError();
    }

    if (!client) throw new ClientNotFound();

    return client || null;
}

export const createClient = async ({ 
    tx = null, 
    clientDto 
}) => {

    const db = getDb(tx);

    try {

        const createdClient = await db.client.create({
            data: { ...clientDto }
        });

        return createdClient;

    } catch (err) {

        throw new ClientCreateDatabaseError();
    }
};

export const updateClient = async ({ 
    tx = null, 
    id, 
    clientDto 
}) => {

    const db = getDb(tx);

    try {

        return await db.client.update({
            where: { id },
            data: { ...clientDto }
        });

    } catch (err) {

        if (err.code === 'P2025') throw new ClientNotFound();
        throw new ClientFindDatabaseError();
    }
}