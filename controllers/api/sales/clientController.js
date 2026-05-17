import { createClientDtoForRegister } from "../../../dtos/clientDTO.js";
import { successCodeMessages } from "../../../messages/codeMessages.js";
import { createClient, findAllClients } from "../../../services/sales/clientService.js";
import { sanitizeEmptyStrings } from "../../../utils/formattersUtils.js";

export const getAllClients = async (req, res) => {

    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    const search = req.query['search[value]'] || req.query.search || '';
    const advisorId = req.query.advisorId || null;

    const columns = ['name'];
    const orderColumnIndex = req.query.order?.[0]?.column || 0;
    const orderDir = req.query.order?.[0]?.dir || 'asc';

    const result = await findAllClients({
        advisorId,
        skip: start,
        take: length,
        search,
        orderBy: columns[orderColumnIndex],
        orderDir
    });

    res.status(200).json(result);
};

export const registerClient = async (req, res) => {

    const clientDto = createClientDtoForRegister(req.body);
    const sanitizedClientDto = sanitizeEmptyStrings(clientDto);

    const client = await createClient(sanitizedClientDto);

    res.status(200).json({
        client,
        code: successCodeMessages.CREATED_CLIENT
    });
}