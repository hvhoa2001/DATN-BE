import express, { Response } from "express";
import { ExtendedRequest } from "../../controllers/type";
import {
  getUserName,
  getUserProfile,
} from "../../controllers/user-services/userController";
import { verifyToken } from "../../middleware/auth";

const router = express.Router();

router.get("/profile/:userId", async (req: ExtendedRequest, res: Response) => {
  try {
    const userData = await getUserProfile(req);
    res.status(200);
    res.json(userData);
  } catch (error) {
    let message = "Unknow Error";
    res.status(400);
    if (error instanceof Error) {
      message = error.message;
    }
    res.send(message);
  }
});

router.get(
  "/getUserName",
  verifyToken,
  async (req: ExtendedRequest, res: Response) => {
    try {
      const result = await getUserName(req);
      res.json(result);
    } catch (error) {
      let message = "Unknow error";
      if (error instanceof Error) {
        message = error.message;
      }
      res.status(404);
      res.end(message);
    }
  }
);

export { router as userRouter };
