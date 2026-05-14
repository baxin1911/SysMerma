import express from 'express';
import { authorizeUserWeb, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { getWastesPage } from '../../../controllers/web/warehouse/wasteController.js';

const router = express.Router();

const productPagePermissions = {
    roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Operador', 'Instalador', 'Vendedor', 'Administrador del sistema'],
    departments: ['ALMACÉN Y PROVEDURÍA', 'SISTEMAS', 'VENTAS Y PROYECTOS ESPECIALES']
};

router.get(
    '/', 
    verifyCookiesAuthTokenRequired,
    authorizeUserWeb(productPagePermissions),
    getWastesPage
);

export default router;
