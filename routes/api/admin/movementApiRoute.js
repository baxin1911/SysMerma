import express from 'express';
import { authorizeUserApi, verifyApiTokenRequired } from "../../../middleware/authMiddleware.js";
import { getAllMovements } from '../../../controllers/api/admin/movementController.js';

const router = express.Router();
const movementReadPermissions = {
    roles: [ 'Administrador del sistema' ],
    departments: [ 'SISTEMAS' ]
};

router.get(
    '/',
    verifyApiTokenRequired,
    authorizeUserApi(movementReadPermissions),
    getAllMovements
);

export default router;