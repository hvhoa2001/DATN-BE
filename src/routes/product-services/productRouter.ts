import express, { Request, Response } from "express";
import {
  createNewProduct,
  getAllProducts,
} from "../../controllers/product-services/productController";
import { verifyToken } from "../../middleware/auth";
import { ExtendedRequest } from "../../controllers/type";

const router = express.Router();

router.post(
  "/new-product",
  verifyToken,
  async (req: ExtendedRequest, res: Response) => {
    try {
      const createdProduct = await createNewProduct(req);
      res.send({ productId: createdProduct });
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

router.get("/getAllProducts", async (req: Request, res: Response) => {
  try {
    const result = await getAllProducts(req);
    res.send(result);
  } catch (err: any) {
    let message = "Unknown error";
    if (err instanceof Error) {
      message = err.message;
    }
    res.statusMessage = message;
    res.status(400).end();
  }
});

export { router as productRouter };
