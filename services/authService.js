import { createUserDtoForToken } from "../dtos/userDTO.js";
import { loginError, authError, detectedReuseError } from "../errors/authError.js";
import { encryptToken } from "../utils/encryptionUtils.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "./jwtService.js";
import { getUserIdByLogin } from "./userService.js";

export const loginUser = async ({ name, password }) => {

    const userId = await getUserIdByLogin(name, password);

    if (!userId) throw new loginError();

    const tokenDto = createUserDtoForToken(userId);
    const newRefreshToken = generateRefreshToken(tokenDto);
    const newAccessToken = generateAccessToken(tokenDto);
    const hashedToken = encryptToken(newRefreshToken);

    return {
        newAccessToken,
        newRefreshToken
    };
}

export const getNewRefreshToken = async ({ refreshToken }) => {

    if (!refreshToken) throw new authError();

    const hashedToken = encryptToken(refreshToken);

    const tokenInfo = verifyRefreshToken(refreshToken);

    if (!tokenInfo) throw new authError();

    const { id } = tokenInfo;
    const tokenDto = createUserDtoForToken(id);
    const newAccessToken = generateAccessToken(tokenDto);
    const newRefreshToken = generateRefreshToken(tokenDto);

    return {
        newAccessToken,
        newRefreshToken
    };
}