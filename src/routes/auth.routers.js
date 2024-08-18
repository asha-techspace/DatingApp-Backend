import { Router } from "express";
import passport from "passport";
import { handleGoogleCallback, handleLogout, loginSuccess } from "../controllers/auth/auth.controller.js";
import { googleAuthCallback, logoutUser } from "../middlewares/googleAuth.middleware.js";
import { login } from '../controllers/authController';

const router = Router();

router.route('/auth/google')
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router.route("/auth/google/callback")
  .get(googleAuthCallback, handleGoogleCallback);

router.route("/login/success").get(loginSuccess);

router.route("/logout").get(logoutUser, handleLogout);

router.post('/login', login);

export default router;