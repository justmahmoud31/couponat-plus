import express from 'express';
import { authorizeRoles, isAuthenticated } from '../../Middlewares/auth.middleware.js';
import { getStats, search } from './Controllers/getstats.controller.js';
const router = express.Router();
router.get('/stats', isAuthenticated, authorizeRoles("admin"), getStats);
router.get('/search', search);
export default router;