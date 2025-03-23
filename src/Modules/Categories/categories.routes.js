import express from "express";
import { singleFile } from "../../Config/multerConfig.js";
import { addCategory } from "./Controllers/addcategory.controller.js";
import { getAllActiveCategories, getAllCategories, getByBestCategory, getCategoryBySlug, getOneCategory } from "./Controllers/getcategory.controller.js";
import { deleteOldFiles } from "../../Middlewares/deleteOldFiles.js";
import { editCategory } from "./Controllers/editcategory.controller.js";
import { Category } from "../../../database/Models/Category.js";
import { deleteCategory } from "./Controllers/deletecategory.controller.js";
import { authorizeRoles, isAuthenticated } from "../../Middlewares/auth.middleware.js";


const router = express.Router();

router.post("/addcategory", isAuthenticated, authorizeRoles("admin"), singleFile("image", "categories"), addCategory);
router.patch(
    "/editcategory/:id",
    isAuthenticated,
    authorizeRoles("admin"),
    deleteOldFiles(Category, { image: "image" }), // Deletes old image if a new one is uploaded
    singleFile("image", "categories"), // Handles new file upload
    editCategory
);
router.get('/', isAuthenticated, authorizeRoles("admin"), getAllCategories);
router.get('/all',getAllActiveCategories);
router.get('/getonecategory/:id', getOneCategory);
router.get('/:slug', getCategoryBySlug);
router.get('/bybest/:best', getByBestCategory);
router.delete('/deletecateory/:id', isAuthenticated, authorizeRoles("admin"), deleteCategory);
export default router;
