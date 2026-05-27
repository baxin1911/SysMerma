import express from 'express';
import { authorizeUserWeb, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { getClientPage } from '../../../controllers/web/sales/clientController.js';

const router = express.Router();

const clientPagePermissions = {
    roles: ['Administrador del sistema'],
    departments: ['SISTEMAS']
};

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    authorizeUserWeb(clientPagePermissions),
    getClientPage
);

export default router;