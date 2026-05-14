import jwt from 'jsonwebtoken';
import { encryptToken } from '../utils/encryptionUtils.js';

const JWT_SECRET_ACCESS = process.env.JWT_SECRET_ACCESS;
const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH;
const JWT_SECRET_ONE_TIME = process.env.JWT_SECRET_ONE_TIME;

export const generateAccessToken = (payload) => {

    return jwt.sign(payload, JWT_SECRET_ACCESS, { expiresIn: '1h' });
}

export const generateOneTimeToken = (id, purpose) => {

    const payload = { id, purpose };

    return jwt.sign(payload, JWT_SECRET_ONE_TIME, { expiresIn: '15m' });
}

export const generateRefreshToken = (payload) => {

    const token = jwt.sign(payload, JWT_SECRET_REFRESH, { expiresIn: '7d' });

    return token;
}

export const verifyToken = (token, secretAccess) => {

    try {

        return jwt.verify(token, secretAccess);

    } catch (err) {

        return null;
    }
}

export const verifyRefreshToken = (token) => verifyToken(token, JWT_SECRET_REFRESH);

export const verifyAccessToken = (token) => verifyToken(token, JWT_SECRET_ACCESS);

export const verifyOneTimeToken = (token) => verifyToken(token, JWT_SECRET_ONE_TIME);