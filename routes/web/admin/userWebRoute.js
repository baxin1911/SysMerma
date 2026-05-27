import express from 'express';
import { authorizeUserWeb, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { getUsersPage } from '../../../controllers/web/admin/userController.js';

const router = express.Router();

const permissions = {
    roles: ['Administrador del sistema'],
    departments: ['SISTEMAS']
};

router.get(
    '/', 
    verifyCookiesAuthTokenRequired, 
    authorizeUserWeb(permissions), 
    getUsersPage
);

export default router;
