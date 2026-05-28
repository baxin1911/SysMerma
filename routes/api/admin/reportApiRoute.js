import express from 'express';
import { authorizeUserApi, verifyApiTokenRequired } from "../../../middleware/authMiddleware.js";
import { exportMovementReport } from '../../../controllers/api/admin/reportController.js';

const router = express.Router();
const reportPermissions = {
    roles: ['Administrador del sistema'],
    departments: ['SISTEMAS']
};

router.get(
    '/movements/excel', 
    verifyApiTokenRequired, 
    authorizeUserApi(reportPermissions), 
    exportMovementReport
);

export default router;