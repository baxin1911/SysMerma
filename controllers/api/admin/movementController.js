import { findAllMovements } from "../../../services/inventory/movementQueryService.js";
import { getDataTableOrder, getDataTablePaging, getDataTableSearch } from "../../../utils/requestQueryUtils.js";

export const getAllMovements = async (req, res) => {

    const { skip, take } = getDataTablePaging(req.query);
    const search = getDataTableSearch(req.query);
    const startDate = req.query.startDate || '';
    const endDate = req.query.endDate || '';
    const movementType = req.query.movementType || '';
    const productId = req.query.productId || '';
    const supplierId = req.query.supplierId || '';
    const columns = ['date', 'type', 'referenceNumber', null, null, null, null, null, null, null, null, null, null];
    const { orderBy, orderDir } = getDataTableOrder({
        query: req.query,
        columns,
        defaultDirection: 'desc'
    });

    const result = await findAllMovements({
        skip,
        take,
        search,
        startDate,
        endDate,
        movementType,
        productId,
        supplierId,
        orderBy,
        orderDir,
    });

    return res.status(200).json(result);
};