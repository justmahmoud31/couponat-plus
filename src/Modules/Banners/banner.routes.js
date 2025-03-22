import express from 'express';
import { mixedFiles } from '../../Config/multerConfig.js';
import { authorizeRoles, isAuthenticated } from '../../Middlewares/auth.middleware.js';
import { addBanner } from './Controllers/addbanner.controller.js';
import { deleteBanner } from './Controllers/deletebanner.controller.js';
import { editBanner } from './Controllers/editbanner.controller.js';
import { getAllActiveBanners, getAllBanners } from './Controllers/getbanners.controller.js';
const router = express.Router();
router.get('/', isAuthenticated, authorizeRoles("admin"), getAllBanners);
router.get('/all', getAllActiveBanners);
router.post(
    '/',
    isAuthenticated,
    authorizeRoles("admin"),
    mixedFiles([{ name: "images", maxCount: 5 }], "banner"), // Fix: Pass an array of objects
    addBanner
);

router.delete('/:id', isAuthenticated, authorizeRoles("admin"), deleteBanner);
router.patch(
    "/:id",
    isAuthenticated,
    authorizeRoles("admin"),
    mixedFiles([{ name: "images", maxCount: 5 }], "banner"), // Pass as an array
    editBanner
);

export default router;