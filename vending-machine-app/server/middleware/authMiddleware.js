const jwt = require('jsonwebtoken'); // You'll need to install this: npm install jsonwebtoken

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Get token from header

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, 'je2v!he6'); // Replace with your actual secret
        req.user = decoded.user; // Add user info to request
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const authorize = (role) => (req, res, next) => {
    if (req.user && req.user.role === role) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized' });
    }
};


module.exports = { authenticate, authorize };