import express from 'express';
import { authorizeUserApi, verifyApiTokenRequired } from '../../../middleware/authMiddleware.js';
import { editProduct, editProductStock, getAllProducts, registerProduct } from '../../../controllers/api/warehouse/productController.js';
import { productStockValidation, productValidation } from '../../../validators/forms/productValidations.js';
import { validate } from '../../../middleware/validatorMiddleware.js';

const router = express.Router();

const productReadPermissions = {
    roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Operador', 'Instalador', 'Vendedor', 'Administrador del sistema'],
    departments: ['ALMACÉN Y PROVEDURÍA', 'SISTEMAS', 'VENTAS Y PROYECTOS ESPECIALES']
};

const productWritePermissions = {
    roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Administrador del sistema'],
    departments: ['ALMACÉN Y PROVEDURÍA', 'SISTEMAS']
};

router.get(
    '/',
    verifyApiTokenRequired,
    authorizeUserApi(productReadPermissions),
    getAllProducts
);

router.post(
    '/',
    verifyApiTokenRequired,
    productValidation,
    validate,
    authorizeUserApi(productWritePermissions),
    registerProduct
);

router.patch(
    '/:id',
    verifyApiTokenRequired,
    productValidation,
    validate,
    authorizeUserApi(productWritePermissions),
    editProduct
);

router.patch(
    '/:id/stock',
    verifyApiTokenRequired,
    productStockValidation,
    validate,
    authorizeUserApi(productWritePermissions),
    editProductStock
);

export default router;
