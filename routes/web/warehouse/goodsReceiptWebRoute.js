import express from 'express';
import { authorizeUserWeb, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { getGoodsReceiptsPage } from '../../../controllers/web/warehouse/goodsReceiptController.js';

const router = express.Router();

const goodsReceiptPagePermissions = {
    roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Administrador del sistema'],
    departments: ['ALMACÉN Y PROVEDURÍA', 'SISTEMAS']
};

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    authorizeUserWeb(goodsReceiptPagePermissions),
    getGoodsReceiptsPage
);

export default router;
