import { Request } from "express";

export type ExtendedRequest = Request & {
  userVerifiedData?: {
    userId: string;
  };
  productVerifiedData?: {
    productId: string;
  };
};
