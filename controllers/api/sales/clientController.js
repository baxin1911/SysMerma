import { createClientDto } from "../../../dtos/clientDTO.js";
import { successCodeMessages } from "../../../messages/codeMessages.js";
import { createClient, findAllClients, updateClient } from "../../../services/sales/clientService.js";
import { sanitizeEmptyStrings } from "../../../utils/formattersUtils.js";
import { getDataTableOrder, getDataTablePaging, getDataTableSearch } from "../../../utils/requestQueryUtils.js";

export const getAllClients = async (req, res) => {

    const { skip, take } = getDataTablePaging(req.query);
    const search = getDataTableSearch(req.query);
    const advisorId = req.query.advisorId || null;

    const columns = ['name', null];
    const { orderBy, orderDir } = getDataTableOrder({
        query: req.query,
        columns
    });

    const result = await findAllClients({
        advisorId,
        skip,
        take,
        search,
        orderBy,
        orderDir
    });

    res.status(200).json(result);
};

export const registerClient = async (req, res) => {

    const clientDto = createClientDto(req.body);
    const sanitizedClientDto = sanitizeEmptyStrings(clientDto);

    const client = await createClient(sanitizedClientDto);

    res.status(200).json({
        client,
        code: successCodeMessages.CREATED_CLIENT
    });
}

export const editClient = async (req, res) => {

    const { id } = req.params;
    const clientDto = createClientDto(req.body);
    const sanitizedClientDto = sanitizeEmptyStrings(clientDto);

    const client = await updateClient({
        id,
        clientDto: sanitizedClientDto
    });

    return res.status(200).json({
        client,
        code: successCodeMessages.UPDATED_CLIENT
    });
}