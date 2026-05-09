import express from 'express';
import { authorizeUserWeb, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { getGoodsIssuesPage } from '../../../controllers/web/warehouse/goodsIssueController.js';

const router = express.Router();

const goodsIssuePagePermissions = {
    roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Administrador del sistema'],
    departments: ['ALMACÉN Y PROVEDURÍA', 'SISTEMAS']
};

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    authorizeUserWeb(goodsIssuePagePermissions),
    getGoodsIssuesPage
);

export default router;
