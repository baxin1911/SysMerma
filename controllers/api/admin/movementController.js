import { findAllMovements } from "../../../services/inventory/movementQueryService.js";

export const getAllMovements = async (req, res) => {

    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    const search = req.query['search[value]'] || '';
    const startDate = req.query.startDate || '';
    const endDate = req.query.endDate || '';
    const movementType = req.query.movementType || '';
    const productId = req.query.productId || '';
    const supplierId = req.query.supplierId || '';
    const columns = ['date'];
    const orderColumnIndex = req.query.order?.[0]?.column || 0;
    const orderDir = req.query.order?.[0]?.dir || 'desc';

    const result = await findAllMovements({
        skip: start,
        take: length,
        search,
        startDate,
        endDate,
        movementType,
        productId,
        supplierId,
        orderBy: columns[orderColumnIndex],
        orderDir,
    });

    return res.status(200).json(result);
};