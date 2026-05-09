import express from 'express';
import { authorizeUserWeb, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { getPurchaseRequisitionsPage } from '../../../controllers/web/warehouse/purchaseRequisitionController.js';

const router = express.Router();

const purchaseRequisitionPagePermissions = {
    roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Administrador del sistema'],
    departments: ['ALMACÉN Y PROVEDURÍA', 'SISTEMAS']
};

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    authorizeUserWeb(purchaseRequisitionPagePermissions),
    getPurchaseRequisitionsPage
);

export default router;
