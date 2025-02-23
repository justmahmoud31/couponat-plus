import express from 'express';
import { addCoupon } from './Controllers/AddCopoun.controller.js';
import { mixedFiles, singleFile } from '../../Config/multerConfig.js';
import { getAllCopouns, getOneCopoun } from './Controllers/getCopouns.controller.js';
import { deleteCopoun } from './Controllers/deleteCopoun.controller.js';
import { updateCoupon } from './Controllers/editCopoun.controller.js';
const router = express.Router();
router.post(
    "/addcoupon",
    mixedFiles([{ name: "image", maxCount: 1 }, { name: "cover_image", maxCount: 1 }], "coupons"),
    addCoupon
);
router.get('/', getAllCopouns)
router.get('/onecopoun/:id', getOneCopoun);
router.delete('/deletecopoun/:id', deleteCopoun);
router.patch("/editcoupon/:id", singleFile("image", "coupons"), updateCoupon);
export default router;