import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import { authRouter } from "./src/routes/user-services/authRouter";
import { userRouter } from "./src/routes/user-services/userRouter";
import connectMongoDB from "./connect";

const app = express();
const port = process.env.PORT;

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb" }));
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello, world!");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  connectMongoDB();
});
