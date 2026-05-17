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

export const findClientById = async ({ tx, id }) => {

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

export const createClient = async (clientDto) => {

    try {

        const createdClient = await getDb().client.create({
            data: {
                name: clientDto.name,
                advisorId: clientDto.advisorId
            }
        });

        return createdClient;

    } catch (err) {
        
        throw new ClientCreateDatabaseError();
    }
};