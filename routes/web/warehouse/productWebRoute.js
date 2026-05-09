import express from 'express';
import { getProductsPage } from '../../../controllers/web/warehouse/productController.js';
import { authorizeUserWeb, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';

const router = express.Router();

const productPagePermissions = {
    roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Operador', 'Instalador', 'Vendedor', 'Administrador del sistema'],
    departments: ['ALMACÉN Y PROVEDURÍA', 'SISTEMAS', 'VENTAS Y PROYECTOS ESPECIALES']
};

router.get(
    '/', 
    verifyCookiesAuthTokenRequired,
    authorizeUserWeb(productPagePermissions),
    getProductsPage
);

export default router;
