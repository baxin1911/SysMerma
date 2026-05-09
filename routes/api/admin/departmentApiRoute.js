import express from 'express';
import { authorizeUserApi, verifyApiTokenRequired } from "../../../middleware/authMiddleware.js";
import { getAllDepartments } from '../../../controllers/api/admin/departmentController.js';

const router = express.Router();
const departmentReadPermissions = {
    roles: [ 'Administrador del sistema', 'Coordinador', 'Auxiliar', 'Operador', 'Instalador', 'Diseñador', 'Almacenista', 'Vendedor', 'Repartidor' ],
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

router.get(
    '/',
    verifyApiTokenRequired,
    authorizeUserApi(departmentReadPermissions),
    getAllDepartments
);

export default router;