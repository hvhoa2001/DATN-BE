import { Response, NextFunction } from "express";
import { ExtendedRequest } from "../controllers/type";
import { AuthModel } from "../models/AuthSchema";

export default function permit(...permittedRoles: string[]) {
  return async (
    request: ExtendedRequest,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = request.userVerifiedData || {};
      const user = await AuthModel.findOne({ userId: userId });

      if (!user) {
        return response.status(401).json({ message: "Unauthorized" });
      }
      if (permittedRoles.includes(user.role)) {
        next();
      } else {
        response.status(403).json({ message: "Forbidden" });
      }
    } catch (error) {
      response.status(500).json({ message: "Internal server error" });
    }
  };
}
