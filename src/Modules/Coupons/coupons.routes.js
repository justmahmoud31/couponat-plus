import express from 'express';
import { addCoupon } from './Controllers/AddCopoun.controller.js';
import { mixedFiles } from '../../Config/multerConfig.js';
const router = express.Router();
router.post(
    "/addcoupon",
    mixedFiles([{ name: "image", maxCount: 1 }, { name: "cover_image", maxCount: 1 }], "coupons"),
    addCoupon
);
export default router;