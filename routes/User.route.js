import express from "express";
const router = express.Router();
import upload from "../middleware/multer.js";

import {registerUser,loginUser,logoutUser,forgotPassword,resetPassword,getUserDetails,updatePassword,updateProfile,getAllUser,getSingleUser,updateUserRole,deleteUser} from "../controllers/User.controller.js";
import {isAuthenticatedUser,authorizeRole} from "../middleware/auth.js";

router.route("/register").post(upload.fields([{name:"avatar",maxCount:1}]),registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logoutUser);
router.route("/me").get(isAuthenticatedUser,getUserDetails);
router.route("/password/update").put(isAuthenticatedUser,updatePassword);
router.route("/me/update").put(isAuthenticatedUser,upload.fields([{name:"avatar",maxCount:1}]),updateProfile);
router.route("/admin/users").get(isAuthenticatedUser,authorizeRole("admin"),getAllUser);
router.route("/admin/user/:id").get(isAuthenticatedUser,authorizeRole("admin"),getSingleUser).put(isAuthenticatedUser,authorizeRole("admin"),updateUserRole).delete(isAuthenticatedUser,authorizeRole("admin"),deleteUser);


export default router;