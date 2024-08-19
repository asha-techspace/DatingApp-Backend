import { Router } from "express";
import { registerUser,verifyOtp,loginUser } from "../controllers/auth/localAuth.controller.js";

const router = new Router();

router.route("/register").post(registerUser);
router.route("/verify-otp").post(verifyOtp);
router.route("/login").post(loginUser);


export default router