import express, { Request, Response } from "express";
import {
  BuyAndUpdate,
  claimNFT,
  crawlNFTData,
  getAllProducts,
  getProductByName,
  getUserNFTDetails,
  getUserNFTs,
  syncNFTsToProducts,
} from "../../controllers/nft-services/nftController";
import { verifyToken } from "../../middleware/auth";

const router = express.Router();

router.post("/crawl-nft", async (_req: Request, res: Response) => {
  try {
    const result = await syncNFTsToProducts();
    res.status(200).json(result);
  } catch (err: any) {
    console.error("Error syncing NFT:", err.message);
    res.status(400).json({ error: err.message });
  }
});

router.get("/user-nft", verifyToken, async (req: Request, res: Response) => {
  try {
    const result = await getUserNFTs(req);
    res.send(result);
  } catch (err: any) {
    let message = "Unknown error";
    if (err instanceof Error) {
      message = err.message;
    }
    res.status(400).end(message);
  }
});

router.get(
  "/user-nft-detail",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const result = await getUserNFTDetails(req);
      res.send(result);
    } catch (err: any) {
      let message = "Unknown error";
      if (err instanceof Error) {
        message = err.message;
      }

      res.status(400).json({ error: message });
    }
  }
);
router.post("/crawl-all", async (_req: Request, res: Response) => {
  try {
    const result = await crawlNFTData();
    res.status(200).json(result);
  } catch (err: any) {
    console.error("Error crawling NFT:", err.message);
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
    res.status(400).end(message);
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
    res.status(400).end(message);
  }
});

router.post("/update-nft", verifyToken, async (req: Request, res: Response) => {
  try {
    const result = await BuyAndUpdate(req);
    res.status(200);
    res.json(result);
  } catch (err: any) {
    res.status(400).end(err.message);
  }
});

router.post("/claim-nft", verifyToken, async (req: Request, res: Response) => {
  try {
    const result = await claimNFT(req);
    res.status(200);
    res.json(result);
  } catch (err: any) {
    res.status(400).end(err.message);
  }
});

export { router as nftRouter };
