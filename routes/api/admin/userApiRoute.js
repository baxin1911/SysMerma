import express from 'express';
import { authorizeUserApi, verifyApiTokenRequired } from '../../../middleware/authMiddleware.js';
import { editUser, editUserPassword, getAllUsers, registerUser } from '../../../controllers/api/admin/userController.js';
import { userEditValidation, userPasswordValidation, userValidation } from '../../../validators/forms/userValidations.js';
import { validate } from '../../../middleware/validatorMiddleware.js';

const router = express.Router();

const permissions = {
    roles: ['Administrador del sistema'],
    departments: ['SISTEMAS']
};

router.get(
    '/',
    verifyApiTokenRequired,
    authorizeUserApi(permissions),
    getAllUsers
);

router.post(
    '/',
    verifyApiTokenRequired,
    userValidation,
    validate,
    authorizeUserApi(permissions),
    registerUser
);

router.patch(
    '/:id',
    verifyApiTokenRequired,
    userEditValidation,
    validate,
    authorizeUserApi(permissions),
    editUser
);

router.patch(
    '/:id/password',
    verifyApiTokenRequired,
    userPasswordValidation,
    validate,
    authorizeUserApi(permissions),
    editUserPassword
);

export default router;
