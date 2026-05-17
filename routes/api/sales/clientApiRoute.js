import express from 'express';
import { authorizeUserApi, verifyApiTokenRequired } from '../../../middleware/authMiddleware.js';
import { getAllClients } from '../../../controllers/api/sales/clientController.js';
import { createClient } from '../../../services/sales/clientService.js';

const router = express.Router();
const clientReadPermissions = {
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
        'SISTEMAS',
        'TALLER 3D',
        'VENTAS Y PROYECTOS ESPECIALES'
    ]
};

const clientWritePermissions = {
    roles: ['Administrador del sistema', 'Coordinador', 'Auxiliar', 'Almacenista'],
    departments: [
        'SISTEMAS',
        'ALMACÉN Y PROVEDURÍA',
        'ADMINISTRATIVO'
    ]
};

router.get(
    '/',
    verifyApiTokenRequired,
    authorizeUserApi(clientReadPermissions),
    getAllClients
);

router.post(
    '/',
    verifyApiTokenRequired,
    authorizeUserApi(clientWritePermissions),
    createClient
);

export default router;