import { successCodeMessages } from '../../messages/codeMessages.js';
import { errorMessages, successMessages } from '../../messages/messages.js';
import { redirectWithFlash } from '../../utils/flashUtils.js';
import { clearAuthCookies, setAuthCookies } from '../../utils/cookiesUtils.js';
import { getNewRefreshToken } from '../../services/authService.js';

export const login = async (req, res) => {

    return res.render('pages/home/loginPage');
}

export const refreshAuthToken = async (req, res) => {

    try {
        const { refreshToken } = req.cookies;
        const result = await getNewRefreshToken({ refreshToken });
        
        const returnTo = req.cookies.returnTo;

        res.clearCookie('returnTo');
        setAuthCookies(res, result.newAccessToken, result.newRefreshToken);

        return res.redirect(returnTo || req.headers.referer);

    } catch (error) {

        req.error = error;

        return logout(req, res);
    }
}

export const logout = async (req, res) => {

    res.clearCookie('returnTo');
    clearAuthCookies(res);

    return redirectWithFlash(
        res, 
        req.error ? errorMessages.INVALID_AUTH : successMessages.SUCCESS_LOGOUT, 
        req.error ?? successCodeMessages.SUCCESS_LOGOUT, 
        req.error ? 'error' : 'info'
    );
}