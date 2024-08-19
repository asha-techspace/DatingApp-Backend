import { Router } from "express";
import { verifyUser } from "../middlewares/verifyjwt.middleware.js";
import { createProfile } from "../controllers/profile/addProfile.controller.js";
import upload from "../middlewares/multer.middleware.js"

const router = new Router();
router.route('/profile-details').post(verifyUser, upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'additionalImg', maxCount: 3 },
    { name: 'reel', maxCount: 1 },
]), createProfile)

export default router