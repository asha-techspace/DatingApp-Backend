import { Router } from "express";
import { registerUser, generateOtpAndSend, loginUser } from "../controllers/auth/localAuth.controller.js";
import { verifyUser } from "../middlewares/verifyjwt.middleware.js";
import { createProfile } from "../controllers/profile/addProfile.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { relationshipGoalsController } from "../controllers/profile/relationshipGoalsController.js";
import { setInterest } from "../controllers/profile/interest.controller.js";
import { jobDetails, moreJobDetails } from "../controllers/profile/personalDetails.js";
import { getProfilesByQualification } from "../controllers/profile/profileController.js"
import { getUserIdsAndQualifications } from '../controllers/profile/UserIdsAndQualifications.js';

const router = new Router();

// Routes from emailotp branch
router.route("/register").post(registerUser);
router.route("/generateotp").post(generateOtpAndSend);
router.route("/login").post(loginUser);

// Routes from main branch
router.route('/profile-details').post(verifyUser, upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'additionalImg', maxCount: 3 },
    { name: 'reel', maxCount: 1 },
]), createProfile);

router.route('/relationship-goals').patch(verifyUser, relationshipGoalsController);

// New route for setting interest
router.route('/set-interest').patch(verifyUser, setInterest);

//job details
router.post('/job_details',verifyUser, jobDetails);
router.patch('/more_job_details',verifyUser, moreJobDetails);


//  get profiles based on qualification
router.get('/qualification', getProfilesByQualification);


// Route to get all user IDs and qualifications
router.get('/user-qualifications', getUserIdsAndQualifications);


export default router;
