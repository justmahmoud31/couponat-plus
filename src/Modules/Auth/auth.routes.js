import express from "express";
import {
  addAdmin,
  deleteUser,
  forgetPassword,
  login,
  promoteUserToAdmin,
  resendVerificationCode,
  resetPassword,
  signup,
  verifyForgetPasswordOtp,
  verifyOTP,
  verifyLoginOTP,
} from "./Controllers/auth.controller.js";
import {
  authorizeRoles,
  isAuthenticated,
} from "../../Middlewares/auth.middleware.js";
import {
  getAllUsers,
  getUserById,
  getUserData,
} from "./Controllers/getusers.controller.js";
import {
  adminEditUser,
  updateUserProfile,
} from "./Controllers/edituser.controller.js";
import { singleFile } from "../../Config/multerConfig.js";

const router = express.Router();
router.post("/signup", singleFile("profilePicture", "user"), signup);
router.post(
  "/addadmin",
  isAuthenticated,
  authorizeRoles("admin"),
  singleFile("profilePicture", "user"),
  addAdmin
);
router.post("/login", login);
router.post("/verifyotp", verifyOTP);
router.post("/forgetpassword", forgetPassword);
router.post("/verifyforgetpasswordotp", verifyForgetPasswordOtp);
router.post("/resetpassword", resetPassword);
router.post("/resendotp", resendVerificationCode);
router.post("/verify-login-otp", verifyLoginOTP);
router.delete(
  "/users/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteUser
);
router.get("/", isAuthenticated, authorizeRoles("admin"), getAllUsers);
router.get("/me", isAuthenticated, getUserData);
router.get("/users/:id", isAuthenticated, authorizeRoles("admin"), getUserById);
router.patch(
  "/",
  isAuthenticated,
  singleFile("profilePicture", "user"),
  updateUserProfile
);
router.patch(
  "/promote/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  promoteUserToAdmin
);
router.patch(
  "/users/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  singleFile("profilePicture", "user"),
  adminEditUser
);
export default router;
