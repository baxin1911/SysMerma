import { successCodeMessages } from "../../messages/codeMessages.js";
import { setAuthCookies } from "../../utils/cookiesUtils.js";
import { getNewRefreshToken, loginUser } from "../../services/authService.js";

export const login = async (req, res) => {

    const tokens = await loginUser(req.body);

    setAuthCookies(res, tokens.newAccessToken, tokens.newRefreshToken);

    return res.status(200).json({ code: successCodeMessages.SUCCESS_LOGIN });
}

export const refreshAuthToken = async (req, res) => {

    const { refreshToken } = req.cookies;
    const  tokens = await getNewRefreshToken({ refreshToken });

    setAuthCookies(res, tokens.newAccessToken, tokens.newRefreshToken);

    return res.sendStatus(200);
}