import express from 'express';
import { mixedFiles } from '../../Config/multerConfig.js';
import { addproduct } from './Controllers/addproduct.controller.js';
import { getAllProducts, getOneProduct } from './Controllers/getproduct.controller.js';
import { deleteOldFiles } from '../../Middlewares/deleteOldFiles.js';
import { Product } from '../../../database/Models/Product.js';
import { editProduct } from './Controllers/editproduct.controller.js';
import { deleteProduct } from './Controllers/deleteproduct.controller.js';
import { authorizeRoles, isAuthenticated } from '../../Middlewares/auth.middleware.js';
const router = express.Router();
const productFileFields = {
    cover_image: "single",
    images: "multiple"
};

router.patch("/editproduct/:id",
    isAuthenticated,
    authorizeRoles("admin"),
    mixedFiles([{ name: "cover_image", maxCount: 1 }, { name: "images", maxCount: 5 }], "products"),
    deleteOldFiles(Product, productFileFields),
    editProduct
);
router.post('/addproduct', isAuthenticated, authorizeRoles("admin"), mixedFiles([{ name: "images", maxCount: 5 }, { name: "cover_image", maxCount: 1 }], "products"), addproduct);
router.get('/', getAllProducts);
router.get('/getoneproduct/:id', getOneProduct);
router.delete('/deleteproduct/:id', isAuthenticated, authorizeRoles("admin"), deleteProduct);
export default router;