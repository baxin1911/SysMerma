import express from 'express';
import { getAllProfiles } from "../../../controllers/api/admin/profileController.js";
import { authorizeUserApi, verifyApiTokenRequired } from "../../../middleware/authMiddleware.js";

const router = express.Router();
const profileReadPermissions = {
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
    authorizeUserApi(profileReadPermissions),
    getAllProfiles
);

export default router;
