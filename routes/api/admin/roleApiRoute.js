import express from 'express';
import { authorizeUserApi, verifyApiTokenRequired } from '../../../middleware/authMiddleware.js';
import { getAllRoles } from '../../../controllers/api/admin/roleController.js';

const router = express.Router();

const roleReadPermissions = {
    roles: ['Administrador del sistema'],
    departments: ['SISTEMAS']
};

router.get(
    '/',
    verifyApiTokenRequired,
    authorizeUserApi(roleReadPermissions),
    getAllRoles
);

export default router;
