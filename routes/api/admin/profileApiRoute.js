import express from 'express';
import { editProfile, getAllProfiles, registerProfile } from "../../../controllers/api/admin/profileController.js";
import { authorizeUserApi, verifyApiTokenRequired } from "../../../middleware/authMiddleware.js";
import { profileValidation } from '../../../validators/forms/profileValidations.js';

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

const registerProfilePermissions = {
    ...profileReadPermissions,
    roles: [ 'Administrador del sistema' ]
};

router.get(
    '/',
    verifyApiTokenRequired,
    authorizeUserApi(profileReadPermissions),
    getAllProfiles
);

router.post(
    '/',
    verifyApiTokenRequired,
    profileValidation,
    authorizeUserApi(registerProfilePermissions),
    registerProfile
);

router.put(
    '/:id',
    verifyApiTokenRequired,
    profileValidation,
    authorizeUserApi(registerProfilePermissions),
    editProfile
);

export default router;
