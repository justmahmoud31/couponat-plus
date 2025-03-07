import express from 'express';
import { addCoupon } from './Controllers/AddCopoun.controller.js';
import { mixedFiles, singleFile } from '../../Config/multerConfig.js';
import { getAllCopouns, getOneCopoun } from './Controllers/getCopouns.controller.js';
import {deleteCoupon} from './Controllers/deleteCopoun.controller.js';
import { updateCoupon } from './Controllers/editCopoun.controller.js';
import { authorizeRoles, isAuthenticated } from '../../Middlewares/auth.middleware.js';
const router = express.Router();
router.post(
    "/addcoupon",
    isAuthenticated,
    authorizeRoles("admin"),
    mixedFiles([{ name: "image", maxCount: 1 }, { name: "cover_image", maxCount: 1 }], "coupons"),
    addCoupon
);
router.get('/', getAllCopouns)
router.get('/onecopoun/:id', getOneCopoun);
router.delete('/deletecopoun', isAuthenticated, authorizeRoles("admin"), deleteCoupon);
router.patch("/editcoupon/:id", isAuthenticated, authorizeRoles("admin"), singleFile("image", "coupons"), updateCoupon);
export default router;