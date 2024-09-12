import express, { Request, Response } from "express";
import {
  checkEmail,
  login,
  register,
} from "../../controllers/user-services/userController";
import { verifyToken } from "../../middleware/auth";

let router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    await register(req);
    res.status(200);
    res.json({
      success: true,
    });
  } catch (err: any) {
    res.status(400);
    res.end(err.message);
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const jwt = await login(req);
    res.status(200);
    res.json({
      success: true,
      jwt: jwt,
    });
  } catch (err: any) {
    res.status(400);
    res.end(err.message);
  }
});

router.get("/verifyToken", verifyToken, async (req: Request, res: Response) => {
  res.status(200);
  res.json({
    valid: true,
  });
});

router.get("/checkEmail", async (req: Request, res: Response) => {
  try {
    const result = await checkEmail(req);
    if (result) {
      res.json({
        valid: true,
        message: "Email is valid",
      });
    } else {
      res.json({
        valid: false,
        message: "Email existed in other account",
      });
    }
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) {
      message = error.message;
    }
    res.status(404);
    res.end(message);
  }
});

export { router as authRouter };
