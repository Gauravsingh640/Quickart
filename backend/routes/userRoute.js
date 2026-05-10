import express from "express";
import {
  login,
  logout,
  register,
  reVerify,
  verify,
  updateProfile,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { upload } from "../middleware/multer.js";
const router = express.Router();
router.post("/register", register);
router.get("/verify/:token", verify);
router.post("/reverify", reVerify);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.put("/profile/update",isAuthenticated,upload.single("profilePic"),updateProfile);
export default router;
