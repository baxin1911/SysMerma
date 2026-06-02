import { findAllRoles } from "../../../services/admin/roleService.js";
import { getDataTableOrder, getDataTablePaging, getDataTableSearch } from "../../../utils/requestQueryUtils.js";

export const getAllRoles = async (req, res) => {
    const { skip, take } = getDataTablePaging(req.query);
    const search = getDataTableSearch(req.query);

    const columns = ['name'];
    const { orderBy, orderDir } = getDataTableOrder({
        query: req.query,
        columns
    });

    const result = await findAllRoles({ skip, take, search, orderBy, orderDir });
    res.status(200).json(result);
};
