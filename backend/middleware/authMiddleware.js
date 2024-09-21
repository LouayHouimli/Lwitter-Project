import { verifyAccessToken } from '../lib/utils/generateToken.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    const userId = verifyAccessToken(token);
    if (!userId) {
        return res.status(403).json({ message: "Not authorized, token failed" });
    }

    req.user = { _id: userId };
    next();
};