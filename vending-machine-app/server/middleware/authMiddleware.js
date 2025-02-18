const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env (at the top of your file)
const secretKey = process.env.SECRET_KEY;

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        console.log("User authenticated:", decoded.user);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error("JWT Verification Error:", err);

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        } else {
            return res.status(401).json({ message: 'Token is not valid' });
        }
    }
};

module.exports = authenticate;