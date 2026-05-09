import express from 'express';
import { authorizeUserApi, verifyApiTokenRequired } from '../../../middleware/authMiddleware.js';
import { validate } from '../../../middleware/validatorMiddleware.js';
import {
    cancelPurchaseRequisitionStatus,
    confirmPurchaseRequisitionStatus,
    editPurchaseRequisition,
    getAllPurchaseRequisitions,
    registerPurchaseRequisition
} from '../../../controllers/api/warehouse/purchaseRequisitionController.js';
import { purchaseRequisitionValidation } from '../../../validators/forms/purchaseRequisitionValidations.js';

const router = express.Router();

const purchaseRequisitionPermissions = {
    roles: ['Administrador del sistema', 'Coordinador', 'Auxiliar', 'Operador', 'Instalador', 'Almacenista'],
    departments: [
        'DIRECCIÓN',
        'ACABADOS',
        'ADMINISTRATIVO',
        'ALMACÉN Y PROVEDURÍA',
        'DISEÑO',
        'INSTALACIONES',
        'IMPRESIÓN',
        'ROUTER',
        'PT/TRÁFICO',
        'SISTEMAS',
        'TALLER 3D',
        'VENTAS Y PROYECTOS ESPECIALES'
    ]
};

const purchaseRequisitionWarehousePermissions = {
    roles: ['Administrador del sistema', 'Coordinador', 'Auxiliar', 'Operador', 'Instalador', 'Almacenista'],
    departments: ['ALMACÉN Y PROVEDURÍA', 'SISTEMAS']
};

router.get(
    '/',
    verifyApiTokenRequired,
    authorizeUserApi(purchaseRequisitionPermissions),
    getAllPurchaseRequisitions
);

router.post(
    '/',
    verifyApiTokenRequired,
    purchaseRequisitionValidation,
    validate,
    authorizeUserApi(purchaseRequisitionPermissions),
    registerPurchaseRequisition
);

router.put(
    '/:id',
    verifyApiTokenRequired,
    purchaseRequisitionValidation,
    validate,
    authorizeUserApi(purchaseRequisitionPermissions),
    editPurchaseRequisition
);

router.patch(
    '/:id/confirm',
    verifyApiTokenRequired,
    authorizeUserApi(purchaseRequisitionWarehousePermissions),
    confirmPurchaseRequisitionStatus
);

router.patch(
    '/:id/cancel',
    verifyApiTokenRequired,
    authorizeUserApi(purchaseRequisitionWarehousePermissions),
    cancelPurchaseRequisitionStatus
);

export default router;
