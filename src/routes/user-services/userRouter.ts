import express, { Response } from "express";
import { ExtendedRequest } from "../../controllers/type";
import {
  getUserName,
  getUserProfile,
  updateRole,
} from "../../controllers/user-services/userController";
import { verifyToken } from "../../middleware/auth";
import permit from "../../middleware/role";

const router = express.Router();

router.get("/profile/:userId", async (req: ExtendedRequest, res: Response) => {
  try {
    const userData = await getUserProfile(req);
    res.status(200);
    res.json(userData);
  } catch (error) {
    let message = "Unknown Error";
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

router.patch(
  "/:userId/update-role",
  // permit("admin"),
  verifyToken,
  async (req: ExtendedRequest, res: Response) => {
    try {
      const result = await updateRole(req);
      res.status(200);
      res.json(result);
    } catch (err: any) {
      res.status(400);
      res.end(err.message);
    }
  }
);

export { router as userRouter };
