import express from 'express';
import { authorizeRoles, isAuthenticated } from '../../Middlewares/auth.middleware.js';
import { adddevent } from './Controllers/addevent.controller.js';
import { singleFile } from '../../Config/multerConfig.js';
import { getAllEvents } from './Controllers/getevent.controller.js';
const router = express.Router();
router.post('/', singleFile("cover_img", "events"), isAuthenticated, authorizeRoles("admin"), adddevent);
router.get('/', getAllEvents);
export default router;