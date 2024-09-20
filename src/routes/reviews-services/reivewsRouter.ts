import express, { Request, Response } from "express";
import { verifyToken } from "../../middleware/auth";
import { ExtendedRequest } from "../../controllers/type";
import {
  createNewReview,
  getAllReviews,
} from "../../controllers/reviews-services/reviewsController";

const router = express.Router();

router.post(
  "/new-review",
  verifyToken,
  async (req: ExtendedRequest, res: Response) => {
    try {
      const createReview = await createNewReview(req);
      res.send({ reviewId: createReview });
      res.end();
    } catch (error) {
      let message = "Unknow error";
      if (error instanceof Error) {
        message = error.message;
      }
      res.statusMessage = message;
      res.status(400).send({ message });
    }
  }
);

router.get(
  "/get-review-list",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const result = await getAllReviews(req);
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

export { router as reviewRouter };
