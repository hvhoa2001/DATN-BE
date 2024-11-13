import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import session from "express-session";
import { authRouter } from "./src/routes/user-services/authRouter";
import { userRouter } from "./src/routes/user-services/userRouter";
import connectMongoDB from "./connect";
import cors from "cors";
import { productRouter } from "./src/routes/product-services/productRouter";
import { reviewRouter } from "./src/routes/reviews-services/reivewsRouter";
import { favoriteRouter } from "./src/routes/favorite-services/favoriteRouter";
import { cartRouter } from "./src/routes/cart-services/cartRouter";
import { orderRouter } from "./src/routes/order-services/orderRouter";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { AuthModel } from "./src/models/AuthSchema";
import { v4 as uuidv4 } from "uuid";

const app = express();
const port = process.env.PORT;

app.use(
  session({
    secret: process.env.SECRET_KEY!,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

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

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

app.options("*", cors());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/reviews", reviewRouter);
app.use("/favorite", favoriteRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello, world!");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  connectMongoDB();
});
