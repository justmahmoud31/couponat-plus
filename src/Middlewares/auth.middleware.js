import jwt from 'jsonwebtoken';

import { catchError } from './catchError.js';
import { AppError } from '../Utils/AppError.js';
import { User } from '../../database/Models/User.js';

/**
 * Middleware to check if user is authenticated
 */
export const isAuthenticated = catchError(async (req, res, next) => {
    // Get token from request headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('Authentication required. Please login.', 401));
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id
    const user = await User.findById(decoded.id);
    if (!user) {
        return next(new AppError('User belonging to this token no longer exists.', 401));
    }
    
    // Add user to request object
    req.user = user;
    next();
});

/**
 * Middleware to check user roles
 * @param  {...string} roles Authorized roles
 */
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action.', 403));
        }
        next();
    };
};