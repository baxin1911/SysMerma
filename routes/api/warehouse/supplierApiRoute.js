import express from 'express';
import { authorizeUserApi, verifyApiTokenRequired } from '../../../middleware/authMiddleware.js';
import { editSupplier, getAllSuppliers, registerSupplier } from '../../../controllers/api/warehouse/supplierController.js';
import { supplierValidation } from '../../../validators/forms/supplierValidations.js';
import { validate } from '../../../middleware/validatorMiddleware.js';

const router = express.Router();
const supplierPermissions = {
    roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Administrador del sistema'],
    departments: ['ALMACÉN Y PROVEDURÍA', 'SISTEMAS']
};

const supplierEditPermissions = {
    roles: ['Administrador del sistema'],
    departments: ['SISTEMAS']
};

router.get(
    '/',
    verifyApiTokenRequired,
    authorizeUserApi(supplierPermissions),
    getAllSuppliers
);

router.post(
    '/',
    verifyApiTokenRequired,
    supplierValidation,
    validate,
    authorizeUserApi(supplierPermissions),
    registerSupplier
);

router.put(
    '/:id',
    verifyApiTokenRequired,
    supplierValidation,
    validate,
    authorizeUserApi(supplierEditPermissions),
    editSupplier
);

export default router;
