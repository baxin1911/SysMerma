import express from 'express';
import { authorizeUserApi, verifyApiTokenRequired } from '../../../middleware/authMiddleware.js';
import { getLatestNotifications, readAllNotifications } from '../../../controllers/api/warehouse/notificationController.js';

const router = express.Router();

const notificationPermissions = {
    roles: ['Administrador del sistema', 'Coordinador', 'Auxiliar', 'Operador', 'Instalador', 'Almacenista'],
    departments: [
        'DIRECCIÓN',
        'ACABADOS',
        'ADMINISTRATIVO',
        'ALMACÉN Y PROVEDURÍA',
        'DISEÑO',
        'INSTALACIONES',
        'IMPRESIÓN',
        'ROUTER',
        'PT/TRÁFICO',
        'SERVICIOS Y VIGILANCIA',
        'SISTEMAS',
        'TALLER 3D',
        'VENTAS Y PROYECTOS ESPECIALES'
    ]
};

router.get(
    '/',
    verifyApiTokenRequired,
    authorizeUserApi(notificationPermissions),
    getLatestNotifications
);

router.patch(
    '/read-all',
    verifyApiTokenRequired,
    authorizeUserApi(notificationPermissions),
    readAllNotifications
);

export default router;
