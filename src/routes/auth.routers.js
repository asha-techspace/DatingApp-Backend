import { Router } from "express";
import passport from "passport";
import { handleGoogleCallback, handleLogout, loginSuccess } from "../controllers/auth/auth.controller.js";
import { googleAuthCallback, logoutUser } from "../middlewares/googleAuth.middleware.js";

const router = Router();

router.route('/auth/google')
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router.route("/auth/google/callback")
  .get(googleAuthCallback, handleGoogleCallback);

router.route("/login/success").get(loginSuccess);

router.route("/logout").get(logoutUser, handleLogout);


// Normal Authentication

import { registerUser, loginUser, forgotPassword } from '../controllers/auth/authController.js';


router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);

export default router;