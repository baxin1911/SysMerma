import { createUserDtoForEdit, createUserDtoForRegister, createUserPasswordDtoForEdit } from "../../../dtos/userDTO.js";
import { successCodeMessages } from "../../../messages/codeMessages.js";
import { createUser, findAllUsers, updateUser, updateUserPassword } from "../../../services/admin/userService.js";
import { sanitizeEmptyStrings } from "../../../utils/formattersUtils.js";
import { getDataTableOrder, getDataTablePaging, getDataTableSearch } from "../../../utils/requestQueryUtils.js";

export const getAllUsers = async (req, res) => {

    const { skip, take } = getDataTablePaging(req.query);
    const search = getDataTableSearch(req.query);

    const columns = ['name', null, null];
    const { orderBy, orderDir } = getDataTableOrder({
        query: req.query,
        columns
    });

    const result = await findAllUsers({
        skip,
        take,
        search,
        orderBy,
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
