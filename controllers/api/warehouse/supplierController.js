import { createSupplierDtoForRegister } from "../../../dtos/supplierDto.js";
import { successCodeMessages } from "../../../messages/codeMessages.js";
import { findAllSuppliers, createSupplier, updateSupplier } from "../../../services/warehouse/supplierService.js";
import { sanitizeEmptyStrings } from "../../../utils/formattersUtils.js";
import { getDataTableOrder, getDataTablePaging, getDataTableSearch } from "../../../utils/requestQueryUtils.js";

export const getAllSuppliers = async (req, res) => {

    const { skip, take } = getDataTablePaging(req.query);
    const search = getDataTableSearch(req.query);

    const columns = ['tradeName', 'legalName', null];
    const { orderBy, orderDir } = getDataTableOrder({
        query: req.query,
        columns
    });

    const result = await findAllSuppliers({
        skip,
        take,
        search,
        orderBy,
        orderDir
    });

    return res.status(200).json(result);
}

export const registerSupplier = async (req, res) => {

    const supplierDto = createSupplierDtoForRegister(req.body);
    const sanitizedSupplierDto = sanitizeEmptyStrings(supplierDto);

    const supplier = await createSupplier(sanitizedSupplierDto);

    return res.status(200).json({
        supplier,
        code: successCodeMessages.CREATED_SUPPLIER
    });
}

export const editSupplier = async (req, res) => {

    const supplierDto = createSupplierDtoForRegister(req.body);
    const sanitizedSupplierDto = sanitizeEmptyStrings(supplierDto);

    const supplier = await updateSupplier(sanitizedSupplierDto, req.params.id);

    return res.status(200).json({
        supplier,
        code: successCodeMessages.UPDATED_SUPPLIER
    });
}
