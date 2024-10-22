import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { AuthModel } from "../models/AuthSchema";
import { v4 as uuidv4 } from "uuid";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3003/auth/google/callback",
      scope: ["profile", "email", "openid"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await AuthModel.findOne({ email: profile.emails![0].value });
        if (!user) {
          user = new AuthModel({
            userId: uuidv4(),
            email: profile.emails![0].value,
            role: "user",
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;
