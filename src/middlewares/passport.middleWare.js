import passport from "passport";
import OAuth2Strategy from "passport-google-oauth2";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config({
  path: './.env'
});

passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
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

          user.isVerified = true;
          await user.save();
        } else {
          user.isVerified = false;
          await user.save();
        }
        const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET_KEY, {
          expiresIn: "1d",
        });

        return done(null, { user, token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport