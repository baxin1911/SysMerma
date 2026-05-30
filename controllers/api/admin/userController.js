import { createUserDtoForEdit, createUserDtoForRegister, createUserPasswordDtoForEdit } from "../../../dtos/userDTO.js";
import { successCodeMessages } from "../../../messages/codeMessages.js";
import { createUser, findAllUsers, updateUser, updateUserPassword } from "../../../services/admin/userService.js";
import { sanitizeEmptyStrings } from "../../../utils/formattersUtils.js";

export const getAllUsers = async (req, res) => {

    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    const search = req.query['search[value]'] || req.query.search || '';

    const columns = ['name'];
    const orderColumnIndex = req.query.order?.[0]?.column || 0;
    const orderDir = req.query.order?.[0]?.dir || 'asc';

    const result = await findAllUsers({
        skip: start,
        take: length,
        search,
        orderBy: columns[orderColumnIndex],
        orderDir
    });

    return res.status(200).json(result);
};

export const registerUser = async (req, res) => {

    const userDto = createUserDtoForRegister(req.body);
    const sanitizedUserDto = sanitizeEmptyStrings(userDto);

    const user = await createUser({ userDto: sanitizedUserDto });

    return res.status(200).json({ user, code: successCodeMessages.CREATED_USER });
};

export const editUser = async (req, res) => {

    const userId = req.params.id;
    const userDto = createUserDtoForEdit(req.body);
    const sanitizedUserDto = sanitizeEmptyStrings(userDto);

    const user = await updateUser({ id: userId, userDto: sanitizedUserDto });

    return res.status(200).json({ user, code: successCodeMessages.UPDATED_USER });
};

export const editUserPassword = async (req, res) => {

    const userId = req.params.id;
    const userPasswordDto = createUserPasswordDtoForEdit(req.body);
    const sanitizedUserPasswordDto = sanitizeEmptyStrings(userPasswordDto);

    await updateUserPassword({ id: userId, userDto: sanitizedUserPasswordDto });

    return res.status(200).json({ code: successCodeMessages.UPDATED_USER_PASSWORD });
};
