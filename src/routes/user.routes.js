import { Router } from "express";
import { verifyUser } from "../middlewares/verifyjwt.middleware.js";
import { createProfile } from "../controllers/profile/addProfile.controller.js";
import upload from "../middlewares/multer.middleware.js"
import { relationshipGoalsController } from "../controllers/profile/relationshipGoalsController.js";

const router = new Router();

router.route('/profile-details').post(verifyUser, upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'additionalImg', maxCount: 3 },
    { name: 'reel', maxCount: 1 },
]), createProfile)

router.route('/relationship-goals/:id').patch(relationshipGoalsController)

export default router