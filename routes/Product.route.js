import express from "express";
const router = express.Router();
import upload from "../middleware/multer.js";
import {getAllProducts,createProduct,updateProduct,deleteProduct,getProductDetails,createProductReview,getProductReviews,deleteReview,getAdminProducts} from "../controllers/Product.controller.js";
import { isAuthenticatedUser,authorizeRole } from "../middleware/auth.js";



router.route("/products").get(getAllProducts);
router.route("/admin/products").get(isAuthenticatedUser,authorizeRole("admin"),getAdminProducts);
router.route("/admin/product/new").post(isAuthenticatedUser,authorizeRole("admin"),upload.array('images'),createProduct);
router.route("/admin/product/:id").put(isAuthenticatedUser,authorizeRole("admin"),upload.array('images'),updateProduct).delete(isAuthenticatedUser,authorizeRole("admin"),deleteProduct);
router.route("/product/:id").get(getProductDetails);
router.route("/review").put(isAuthenticatedUser,createProductReview);
router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser,deleteReview);

export default router;