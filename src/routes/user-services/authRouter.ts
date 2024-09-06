import express, { Request, Response } from "express";
import { login, register } from "../../controllers/user-sevices/userController";
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

export { router as authRouter };
