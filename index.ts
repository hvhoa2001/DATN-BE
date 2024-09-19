import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import { authRouter } from "./src/routes/user-services/authRouter";
import { userRouter } from "./src/routes/user-services/userRouter";
import connectMongoDB from "./connect";
import cors from "cors";
import { productRouter } from "./src/routes/product-services/productRouter";
import { reviewRouter } from "./src/routes/reviews-services/reivewsRouter";
import { favoriteRouter } from "./src/routes/favorite-services/favoriteRouter";

const app = express();
const port = process.env.PORT;

app.options("*", cors());
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/reviews", reviewRouter);
app.use("/favorite", favoriteRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello, world!");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  connectMongoDB();
});
