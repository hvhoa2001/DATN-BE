import { ExtendedRequest } from "../controllers/type";
import { verifyTokenJWT } from "../utils/auth";

export async function verifyToken(req: ExtendedRequest, res: any, next: any) {
  if (!req.headers.authorization) {
    res.json({
      valid: false,
      err: "No token found",
    });
  } else {
    const result = await verifyTokenJWT(req.headers.authorization);
    if (result.valid) {
      req.userVerifiedData = result;
      next();
    } else {
      res.status(401);
      res.json({
        valid: false,
        err: "Invalid token",
      });
    }
  }
}

export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
