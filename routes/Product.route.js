import express from "express";
const router = express.Router();

import {getAllProducts,createProduct,updateProduct,deleteProduct,getProductDetails,createProductReviews,getProductReviews,deleteReview,getAdminProducts} from "../controllers/Product.controller.js";
import { isAuthenticatedUser,authorizeRole } from "../middleware/auth.js";



router.route("/products").get(getAllProducts);
router.route("/admin/products").get(isAuthenticatedUser,authorizeRole("admin"),getAdminProducts);
router.route("/admin/product/new").post(isAuthenticatedUser,authorizeRole("admin"),createProduct);
router.route("/admin/product/:id").put(isAuthenticatedUser,authorizeRole("admin"),updateProduct).delete(isAuthenticatedUser,authorizeRole("admin"),deleteProduct);
router.route("/product/:id").get(getProductDetails);
router.route("/review").put(isAuthenticatedUser,createProductReviews);
router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser,deleteReview);

export default router;