import express, { Request, Response } from "express";
import {
  getAllProducts,
  getProductByName,
  syncNFTsToProducts,
} from "../../controllers/nft-services/nftController";

const router = express.Router();

router.post("/crawl-nft", async (_req: Request, res: Response) => {
  try {
    const result = await syncNFTsToProducts();
    res.status(200).json(result);
  } catch (err: any) {
    console.error("Error syncing NFTs:", err.message);
    res.status(400).json({ error: err.message });
  }
});

router.get("/get-nft", async (req: Request, res: Response) => {
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

router.get("/get-nft-detail", async (req: Request, res: Response) => {
  try {
    const result = await getProductByName(req);
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

export { router as nftRouter };
