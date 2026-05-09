import express from 'express';
import { authorizeUserApi, verifyApiTokenRequired } from '../../../middleware/authMiddleware.js';
import { getAllUnitMeasures } from '../../../controllers/api/warehouse/unitMeasureController.js';

const router = express.Router();

const unitMeasurePermissions = {
    roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Administrador del sistema'],
    departments: ['ALMACÉN Y PROVEDURÍA', 'SISTEMAS']
};

router.get(
    '/',
    verifyApiTokenRequired,
    authorizeUserApi(unitMeasurePermissions),
    getAllUnitMeasures
);

export default router;
