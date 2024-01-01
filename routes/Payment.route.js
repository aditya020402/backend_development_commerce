import express from "express";

import {processPayment,sendStripeApiKey} from "../controllers/Payment.controller.js";

const router = express.Router();

import { isAuthenticatedUser } from "../middleware/auth.js";


router.route("/payment/process").post(isAuthenticatedUser,processPayment);
router.route("/stripeapikey").get(isAuthenticatedUser,sendStripeApiKey);

export default router;