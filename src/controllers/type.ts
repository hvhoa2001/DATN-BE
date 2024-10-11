import { Request } from "express";
import { Role } from "../models/AuthSchema";

export type ExtendedRequest = Request & {
  userVerifiedData?: {
    userId: string;
    role: Role;
  };
  productVerifiedData?: {
    productId: string;
  };
  reviewVerifiedData?: {
    reviewId: string;
  };
  favoriteVerifiedData?: {
    favoriteId: string;
  };
  orderVerifiedData?: {
    orderId: string;
  };
};
