import express, { Response } from "express";
import { verifyToken } from "../../middleware/auth";
import { ExtendedRequest } from "../../controllers/type";
import {
  createCartItem,
  deleteCartItem,
  getCartItems,
} from "../../controllers/cart-services/cartController";

const router = express.Router();

router.post(
  "/new-cart-item",
  verifyToken,
  async (req: ExtendedRequest, res: Response) => {
    try {
      const createItem = await createCartItem(req);
      res.send({ item: createItem });
      res.end();
    } catch (error) {
      let message = "Unknown error";
      if (error instanceof Error) {
        message = error.message;
      }
      res.statusMessage = message;
      res.status(400).send({ message });
    }
  }
);

router.get(
  "/get-cart-items",
  verifyToken,
  async (req: ExtendedRequest, res: Response) => {
    try {
      const result = await getCartItems(req);
      res.send(result);
    } catch (err: any) {
      let message = "Unknown error";
      if (err instanceof Error) {
        message = err.message;
      }
      res.statusMessage = message;
      res.status(400).end();
    }
  }
);

router.delete(
  "/delete-cart-item",
  verifyToken,
  async (req: ExtendedRequest, res: Response) => {
    try {
      const result = await deleteCartItem(req);
      res.send(result);
    } catch (error: any) {
      res.status(400).end(error.message);
    }
  }
);

export { router as cartRouter };
