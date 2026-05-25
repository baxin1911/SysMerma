import { createProductDtoForRegister, createProductDtoForStockUpdate } from "../../../dtos/productDTO.js";
import { successCodeMessages } from "../../../messages/codeMessages.js";
import { findAllProducts, createProduct, updateProduct, updateProductStock } from "../../../services/warehouse/products/productService.js";
import { sanitizeEmptyStrings } from "../../../utils/formattersUtils.js";

export const getAllProducts = async (req, res) => {

    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    const search = req.query['search[value]'] || req.query.search || '';
    const supplierId = req.query.supplierId || null;

    const columns = ['name'];
    const orderColumnIndex = req.query.order?.[0]?.column || 0;
    const orderDir = req.query.order?.[0]?.dir || 'asc';

    const result = await findAllProducts({
        skip: start,
        take: length,
        search,
        supplierId,
        orderBy: columns[orderColumnIndex],
        orderDir
    });

    res.status(200).json(result);
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