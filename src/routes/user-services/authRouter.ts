import express, { Request, Response } from "express";
import {
  checkEmail,
  googleCallback,
  login,
  register,
} from "../../controllers/user-services/userController";
import { verifyToken } from "../../middleware/auth";
import passport from "../../middleware/passport";

const router = express.Router();

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
      jwt: jwt.token,
      role: jwt.role,
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

router.get(
  "/google-login",
  passport.authenticate("google", { scope: ["profile", "email", "openid"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req: Request, res: Response) => {
    try {
      const result = await googleCallback(req);
      res.status(200);
      // Ví dụ lưu JWT vào cookie
      res.cookie("jwt", result.jwt, { httpOnly: true });
      res.cookie("role", result.role, { httpOnly: true });

      // Chuyển hướng người dùng sau khi đã lưu thông tin
      res.redirect("http://localhost:5173/products");
    } catch (error) {
      let message = "Unknown Error";
      if (error instanceof Error) {
        message = error.message;
      }
      res.status(401);
      res.end(message);
    }
  }
);

export { router as authRouter };
