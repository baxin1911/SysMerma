import { createProductDtoForRegister, createProductDtoForStockUpdate } from "../../../dtos/productDTO.js";
import { successCodeMessages } from "../../../messages/codeMessages.js";
import { findAllProducts, createProduct, updateProduct, updateProductStock } from "../../../services/warehouse/products/productService.js";
import { sanitizeEmptyStrings } from "../../../utils/formattersUtils.js";
import { getDataTableOrder, getDataTablePaging, getDataTableSearch } from "../../../utils/requestQueryUtils.js";

export const getAllProducts = async (req, res) => {

    const { skip, take } = getDataTablePaging(req.query);
    const search = getDataTableSearch(req.query);
    const supplierId = req.query.supplierId || null;

    const columns = ['name', 'base', 'height', null, 'minStock', null, null, null, null, null];
    const { orderBy, orderDir } = getDataTableOrder({
        query: req.query,
        columns
    });

    const result = await findAllProducts({
        skip,
        take,
        search,
        supplierId,
        orderBy,
        orderDir
    });

    return res.status(200).json(result);
}

export const registerProduct = async (req, res) => {

    const productDto = createProductDtoForRegister(req.body);
    const sanitizedProductDto = sanitizeEmptyStrings(productDto);

    const product = await createProduct(sanitizedProductDto);

    return res.status(200).json({
        product,
        code: successCodeMessages.CREATED_PRODUCT
    });
}

export const editProduct = async (req, res) => {

    const productDto = createProductDtoForRegister(req.body);
    const sanitizedProductDto = sanitizeEmptyStrings(productDto);

    const product = await updateProduct(sanitizedProductDto, req.params.id);

    return res.status(200).json({
        product,
        code: successCodeMessages.UPDATED_PRODUCT
    });
}

export const editProductStock = async (req, res) => {

    const productDto = createProductDtoForStockUpdate(req.body);
    const sanitizedProductDto = sanitizeEmptyStrings(productDto);

    const product = await updateProductStock({
        productDto: sanitizedProductDto,
        userId: req.user.id,
        id: req.params.id
    });

    return res.status(200).json({
        product,
        code: successCodeMessages.UPDATED_PRODUCT
    });
}