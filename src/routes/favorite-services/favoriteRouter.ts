import express, { Response } from "express";
import { verifyToken } from "../../middleware/auth";
import { ExtendedRequest } from "../../controllers/type";
import {
  createNewFavorite,
  getAllFavorites,
} from "../../controllers/favorite-services/favoriteController";

const router = express.Router();

router.post(
  "/new-favorite",
  verifyToken,
  async (req: ExtendedRequest, res: Response) => {
    try {
      const createdFavorite = await createNewFavorite(req);
      res.json({
        favoriteId: createdFavorite.favoriteId,
        productId: createdFavorite.productId,
        name: createdFavorite.name,
        price: createdFavorite.price,
      });
    } catch (err: any) {
      res.status(400).end(err.message);
    }
  }
);

router.get(
  "/getAllFavorite",
  verifyToken,
  async (req: ExtendedRequest, res: Response) => {
    try {
      const result = await getAllFavorites(req);
      res.send(result);
    } catch (error) {
      let message = "Unknown Error";
      if (error instanceof Error) {
        message = error.message;
      }
      res.status(404);
      res.end(message);
    }
  }
);

export { router as favoriteRouter };
