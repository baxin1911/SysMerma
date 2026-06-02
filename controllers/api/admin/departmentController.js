import { findAllDepartments } from "../../../services/admin/departmentService.js";
import { getDataTableOrder, getDataTablePaging, getDataTableSearch } from "../../../utils/requestQueryUtils.js";

export const getAllDepartments = async (req, res) => {

    const { skip, take } = getDataTablePaging(req.query);
    const search = getDataTableSearch(req.query);

    const columns = ['name'];
    const { orderBy, orderDir } = getDataTableOrder({
        query: req.query,
        columns
    });

    const result = await findAllDepartments({
        skip,
        take,
        search,
        orderBy,
        orderDir
    });

    res.status(200).json(result);
};