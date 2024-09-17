import express, { Request, Response } from "express";
import {
  createNewProduct,
  getAllProducts,
  getProductDetail,
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
    } catch (err: any) {
      res.status(400);
      res.end(err.message);
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

router.get("/product-detail", async (req: ExtendedRequest, res: Response) => {
  try {
    const productDetail = await getProductDetail(req);
    res.status(200);
    res.json(productDetail);
  } catch (error) {
    let message = "Unknown Error";
    res.status(400);
    if (error instanceof Error) {
      message = error.message;
    }
    res.send(message);
  }
});

export { router as productRouter };
