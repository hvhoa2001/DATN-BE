import express, { Request, Response } from "express";
import {
  addVariantToProduct,
  createNewProduct,
  createSize,
  createVariant,
  getAllProducts,
  getProductDetail,
  getVariantDetail,
} from "../../controllers/product-services/productController";
import { verifyToken } from "../../middleware/auth";
import { ExtendedRequest } from "../../controllers/type";
import permit from "../../middleware/role";

const router = express.Router();

router.post(
  "/new-product",
  verifyToken,
  permit("admin"),
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

router.post(
  "/:productId/variant",
  verifyToken,
  permit("admin"),
  async (req: ExtendedRequest, res: Response) => {
    try {
      const result = await createVariant(req);
      res.send({ variantId: result.variantId });
      res.end();
    } catch (err: any) {
      res.status(400);
      res.end(err.message);
    }
  }
);

router.post(
  "/variants/:variantId/sizes",
  verifyToken,
  permit("admin"),
  async (req: ExtendedRequest, res: Response) => {
    try {
      const result = await createSize(req);
      res.send({ sizeId: result });
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

router.get("/variant-detail", async (req: ExtendedRequest, res: Response) => {
  try {
    const variantDetail = await getVariantDetail(req);
    res.status(200);
    res.json(variantDetail);
  } catch (error) {
    let message = "Unknown Error";
    res.status(400);
    if (error instanceof Error) {
      message = error.message;
    }
    res.send(message);
  }
});

router.post(
  "/add-variant",
  verifyToken,
  async (req: ExtendedRequest, res: Response) => {
    try {
      const result = await addVariantToProduct(req);
      res.send(result);
      res.end();
    } catch (err: any) {
      res.status(400);
      res.end(err.message);
    }
  }
);

export { router as productRouter };
