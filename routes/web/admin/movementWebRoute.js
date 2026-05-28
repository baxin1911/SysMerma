import express from 'express';
import { authorizeUserWeb, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { getMovementPage } from '../../../controllers/web/admin/movementController.js';

const router = express.Router();
const movementReadPermissions = {
    roles: [ 'Administrador del sistema' ],
    departments: [ 'SISTEMAS' ]
};

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    authorizeUserWeb(movementReadPermissions),
    getMovementPage
);

export default router;