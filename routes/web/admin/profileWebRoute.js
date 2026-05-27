import express from 'express';
import { authorizeUserWeb, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { getProfilePage } from '../../../controllers/web/admin/profileController.js';

const router = express.Router();

const profilePagePermissions = {
    roles: ['Administrador del sistema'],
    departments: ['SISTEMAS']
};

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    authorizeUserWeb(profilePagePermissions),
    getProfilePage
);

export default router;