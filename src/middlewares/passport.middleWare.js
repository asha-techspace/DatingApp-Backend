// passport.config.js  
import passport from 'passport';  
import OAuth2Strategy from 'passport-google-oauth2';  
import userModel from '../models/user.model.js'; // Adjust path as needed  
import jwt from 'jsonwebtoken';  
import dotenv from 'dotenv';  
import { generateToken } from '../utils/generateToken.js';

dotenv.config({  
    path: './.env'   
});  

passport.use(  
    new OAuth2Strategy(  
        {  
            clientID: process.env.GOOGLE_CLIENT_ID,  
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,  
            callbackURL: '/auth/google/callback',  
            scope: ['profile', 'email'],  
        },  
        async (accessToken, refreshToken, profile, done) => {  
            try {  
                let user = await userModel.findOne({ googleId: profile.id });  

                if (!user) {  
                    user = new userModel({  
                        googleId: profile.id,  
                        firstName: profile.name.givenName,  
                        lastName: profile.name.familyName,  
                        email: profile.emails[0].value,  
                    });  
                    user.googleSignup = true;
                    user.isVerified = true; // Assuming initial verification  
                    await user.save();  
                } else {
                    user.googleSignup = false;
                    await user.save();  
                }

                const token = generateToken(user?._id);

                return done(null, { user, token }); // Pass user and token data  
            } catch (error) {  
                return done(error, null);  
            }  
        }  
    )  
);  

// Initialize Passport  
export default passport;