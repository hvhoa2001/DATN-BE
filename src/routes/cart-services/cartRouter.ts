import express, { Response } from "express";
import { verifyToken } from "../../middleware/auth";
import { ExtendedRequest } from "../../controllers/type";
import { createCartItem } from "../../controllers/cart-services/cartController";

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

export { router as cartRouter };
