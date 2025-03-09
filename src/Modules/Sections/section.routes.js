import express from 'express';
import getsectionController from './Controllers/getsection.controller.js';
import { addSection } from './Controllers/addsection.controller.js';
import { authorizeRoles, isAuthenticated } from '../../Middlewares/auth.middleware.js';
const router = express.Router();
router.get('/', getsectionController.getSection);
router.post('/', isAuthenticated, authorizeRoles("admin"), addSection);
export default router;