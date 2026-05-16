import express from 'express';
import { authorizeUserApi, verifyApiTokenRequired } from '../../../middleware/authMiddleware.js';
import { validate } from '../../../middleware/validatorMiddleware.js';
import {
    editGoodsIssue,
    editGoodsIssueDetails,
    getAllGoodsIssues,
    registerGoodsIssue,
} from '../../../controllers/api/warehouse/goodsIssueController.js';
import { goodsIssueDetailsValidation, goodsIssueUpdateValidation, goodsIssueValidation } from '../../../validators/forms/goodsIssueValidations.js';

const router = express.Router();

const goodsIssuePermissions = {
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

const goodsIssueDetailsPermissions = {
    roles: ['Coordinador', 'Administrador del sistema'],
    departments: ['ALMACÉN Y PROVEDURÍA', 'SISTEMAS']
};

router.get(
    '/',
    verifyApiTokenRequired,
    authorizeUserApi(goodsIssuePermissions),
    getAllGoodsIssues
);

router.post(
    '/',
    verifyApiTokenRequired,
    goodsIssueValidation,
    validate,
    authorizeUserApi(goodsIssuePermissions),
    registerGoodsIssue
);

router.patch(
    '/:id',
    verifyApiTokenRequired,
    goodsIssueUpdateValidation,
    validate,
    authorizeUserApi(goodsIssuePermissions),
    editGoodsIssue
);

router.patch(
    '/:id/details',
    verifyApiTokenRequired,
    goodsIssueDetailsValidation,
    validate,
    authorizeUserApi(goodsIssueDetailsPermissions),
    editGoodsIssueDetails
);

export default router;
