import express, { Response } from "express";
import { verifyToken } from "../../middleware/auth";
import { ExtendedRequest } from "../../controllers/type";
import {
  createNewFavorite,
  deleteFavoriteItem,
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
        color: createdFavorite.color,
        size: createdFavorite.size,
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

router.delete(
  "/delete-favorite-item",
  verifyToken,
  async (req: ExtendedRequest, res: Response) => {
    try {
      const result = await deleteFavoriteItem(req);
      res.send(result);
    } catch (error: any) {
      res.status(400).end(error.message);
    }
  }
);

export { router as favoriteRouter };
