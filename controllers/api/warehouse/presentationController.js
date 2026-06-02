import { findAllPresentations } from "../../../services/warehouse/presentationService.js";
import { getDataTableOrder, getDataTablePaging, getDataTableSearch } from "../../../utils/requestQueryUtils.js";

export const getAllPresentations = async (req, res) => {

    const { skip, take } = getDataTablePaging(req.query);
    const search = getDataTableSearch(req.query);

    const columns = ['name'];
    const { orderBy, orderDir } = getDataTableOrder({
        query: req.query,
        columns
    });

    const result = await findAllPresentations({
        skip,
        take,
        search,
        orderBy,
        orderDir
    });

    return res.status(200).json(result);
}