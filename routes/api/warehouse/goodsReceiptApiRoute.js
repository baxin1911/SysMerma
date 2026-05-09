import express from 'express';
import { authorizeUserApi, verifyApiTokenRequired } from '../../../middleware/authMiddleware.js';
import { validate } from '../../../middleware/validatorMiddleware.js';
import {
    getAllGoodsReceipts,
    registerGoodsReceipt
} from '../../../controllers/api/warehouse/goodsReceiptController.js';
import { goodsReceiptValidation } from '../../../validators/forms/goodsReceiptValidations.js';

const router = express.Router();
const goodsReceiptPermissions = {
    roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Administrador del sistema'],
    departments: ['ALMACÉN Y PROVEDURÍA', 'SISTEMAS']
};

router.get(
    '/',
    verifyApiTokenRequired,
    authorizeUserApi(goodsReceiptPermissions),
    getAllGoodsReceipts
);

router.post(
    '/',
    verifyApiTokenRequired,
    goodsReceiptValidation,
    validate,
    authorizeUserApi(goodsReceiptPermissions),
    registerGoodsReceipt
);

export default router;
