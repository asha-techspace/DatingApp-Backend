import { Router } from "express";
import passport from "passport";
import { handleGoogleCallback, handleLogout, loginSuccess } from "../controllers/auth/auth.controller.js";
import { googleAuthCallback, logoutUser } from "../middlewares/googleAuth.middleware.js";
import { registerUser, loginUser, forgotPassword, resetPassword } from '../controllers/auth/localAuth.controller.js';
import { setInterest } from '../controllers/interest.controller.js'; // Use import instead of require

const router = Router();

router.route('/auth/google')
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router.route("/auth/google/callback")
  .get(googleAuthCallback, handleGoogleCallback);

router.route("/login/success").get(loginSuccess);

router.route("/logout").get(logoutUser, handleLogout);

// Normal Authentication
router.route('/signup').post(registerUser);
router.route('/login').post(loginUser);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password').patch(resetPassword);

// Interests: (gender)
router.post('/set-interest', setInterest);

export default router;