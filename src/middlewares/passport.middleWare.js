import passport from "passport";
import OAuth2Strategy from "passport-google-oauth2";
import userModel from "../models/user.model.js";
import jwt from "json-web-token";



passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userModel.findOne({ googleId: profile.id });

        if (!user) {
          user = new userModel({
            googleId: profile.id,
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            email: profile.emails[0].value,
          });

          await user.save();
          user.isNewUser = true;
        } else {
          user.isNewUser = false;
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
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