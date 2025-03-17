const jwt = require('jsonwebtoken');
const { User } = require('../models/index');
require('dotenv').config();

const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: false,
                message: 'Authorization token is required in Bearer format',
                data: {}
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.email) {
            return res.status(401).json({
                status: false,
                message: 'Invalid token: Email not found in payload',
                data: {}
            });
        }

        const user = await User.findOne({ email: decoded.email }).select('-password -verificationToken -verificationTokenExpires');
        console.log(user,'user')
        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'User with this email not found',
                data: {}
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                status: false,
                message: 'Invalid or malformed token',
                data: {}
            });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: false,
                message: 'Token has expired',
                data: {}
            });
        }
        return res.status(500).json({
            status: false,
            message: 'Internal server error',
            data: {}
        });
    }
};

module.exports = authenticateUser;