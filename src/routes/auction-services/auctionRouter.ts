import express, { Request, Response, Router } from "express";
import {
  crawlAuctionData,
  getAllAuctions,
  getAuctionDetails,
  getMakeOffer,
  getMakeOfferDetail,
  getUserListing,
  getUserListingDetails,
  updateAuction,
} from "../../controllers/auction-services/auctionController";
import { verifyToken } from "../../middleware/auth";

const router: Router = express.Router();

router.post("/crawl-auction", async (_req: Request, res: Response) => {
  try {
    const result = await crawlAuctionData();
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400);
    res.end(err.message);
  }
});

router.get("/get-auction", async (_req: Request, res: Response) => {
  try {
    const result = await getAllAuctions();
    res.send(result);
  } catch (err: any) {
    let message = "Unknown error";
    if (err instanceof Error) {
      message = err.message;
    }
    res.status(400).json({ error: message });
  }
});

router.get("/get-auction-detail", async (req: Request, res: Response) => {
  try {
    const result = await getAuctionDetails(req);
    res.send(result);
  } catch (err: any) {
    let message = "Unknown error";
    if (err instanceof Error) {
      message = err.message;
    }
    res.status(400).end(message);
  }
});

router.get("/get-listing", verifyToken, async (req: Request, res: Response) => {
  try {
    const result = await getUserListing(req);
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

router.post("/place-bid", verifyToken, async (req: Request, res: Response) => {
  try {
    const result = await updateAuction(req);
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

router.get(
  "/listing-detail",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const result = await getUserListingDetails(req);
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

router.get(
  "/get-make-offer",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const result = await getMakeOffer(req);
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

router.get(
  "/get-make-offer-detail",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const result = await getMakeOfferDetail(req);
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

export { router as auctionRouter };
