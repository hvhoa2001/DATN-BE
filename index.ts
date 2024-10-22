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
