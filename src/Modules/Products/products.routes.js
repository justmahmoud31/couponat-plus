import express from 'express';
import { mixedFiles } from '../../Config/multerConfig.js';
import { addproduct } from './Controllers/addproduct.controller.js';
import { getAllProducts } from './Controllers/getproduct.controller.js';
const router = express.Router();
router.post('/addproduct', mixedFiles([{ name: "images", maxCount: 5 }, { name: "cover_image", maxCount: 1 }], "products"), addproduct);
router.get('/', getAllProducts);
export default router;