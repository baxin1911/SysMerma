import express from 'express';
import { authorizeUserApi, verifyApiTokenRequired } from '../../../middleware/authMiddleware.js';
import { editProduct, editProductStock, getAllProducts, registerProduct } from '../../../controllers/api/warehouse/productController.js';
import { productStockValidation, productValidation } from '../../../validators/forms/productValidations.js';
import { validate } from '../../../middleware/validatorMiddleware.js';
import { departments, productManagerRoles } from '../../../utils/permissionsUtils.js';

const router = express.Router();

const productReadPermissions = {
    roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Operador', 'Instalador', 'Vendedor', 'Administrador del sistema'],
    departments: [departments.warehouse, departments.systems, departments.sales]
};

const productWritePermissions = {
    roles: productManagerRoles,
    departments: [departments.warehouse, departments.systems]
};

const productStockWritePermissions = {
    roles: productManagerRoles,
    departments: [departments.systems]
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
    authorizeUserApi(productWritePermissions),
    productValidation,
    validate,
    registerProduct
);

router.patch(
    '/:id',
    verifyApiTokenRequired,
    authorizeUserApi(productWritePermissions),
    productValidation,
    validate,
    editProduct
);

router.patch(
    '/:id/stock',
    verifyApiTokenRequired,
    authorizeUserApi(productStockWritePermissions),
    productStockValidation,
    validate,
    editProductStock
);

export default router;
