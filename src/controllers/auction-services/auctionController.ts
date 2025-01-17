import { Request } from "express";
import { AuctionContractService } from "../../middleware/Contract/crawlAuctionData";
import {
  AuctionDataModel,
  IAuctionData,
} from "../../models/Auction/AuctionSchema";
import { NFTContractService } from "../../middleware/Contract/crawlNFTData";
import { ExtendedRequest } from "../type";
import { delay } from "../../middleware/auth";

export async function crawlAuctionData() {
  try {
    const auctionContractService = new AuctionContractService();
    const nftContractService = new NFTContractService();

    const auctions = await auctionContractService.getAllAuction();
    const nfts = await nftContractService.getAllNFTs();

    if (!auctions || auctions.length === 0) {
      throw Error("No NFTs found");
    }
    for (const auction of auctions) {
      const nft = nfts.find((nft: any) => nft.tokenId === auction.tokenId);
      const existingProduct = await AuctionDataModel.findOne({
        auctionId: auction.auctionId,
      });
      if (existingProduct) {
        console.info(
          `Auction with auctionId ${auction.auctionId} already exists`
        );
        continue;
      }

      const newAuctionData: IAuctionData = new AuctionDataModel({
        auctionId: auction.auctionId,
        seller: auction.seller,
        minPrice: auction.minPrice,
        maxPrice: auction.maxPrice,
        startTime: auction.startTime,
        endTime: auction.endTime,
        tokenId: auction.tokenId,
        nftContract: auction.nftContract,
        highestBidder: auction.highestBidder,
        highestBid: auction.highestBid,
        claimed: Boolean(auction.claimed),
        image: nft.image,
        description: nft.description,
        size: nft.size,
        name: nft.name,
      });
      try {
        await newAuctionData.save();
        console.info(
          `Auction with auctionId ${auction.auctionId} saved successfully`
        );
      } catch (saveError) {
        console.error(
          `Error saving NFT with auctionId ${auction.auctionId}:`,
          saveError
        );
      }
    }
  } catch (error) {
    console.log("🚀 ~ crawlAuctionData ~ error:", error);
    throw error;
  }
}

export async function getAllAuctions() {
  try {
    const auctions = await AuctionDataModel.find({
      $and: [
        { startTime: { $lt: Math.floor(Date.now() / 1000) } },
        { endTime: { $gt: Math.floor(Date.now() / 1000) } },
      ],
    });

    return auctions;
  } catch (error) {
    console.error("🚀 ~ getAllAuctions ~ error:", error);
    throw new Error("Failed to fetch ongoing auctions");
  }
}

export async function updateAuction(req: Request) {
  try {
    await delay(10000);
    const { auctionId } = req.body;
    const auctionContractService = new AuctionContractService();
    const auctions = await auctionContractService.getAllAuction();

    const isAuctionId = auctions.some(
      (auction: any) => auction.auctionId === Number(auctionId)
    );
    if (isAuctionId) {
      await AuctionDataModel.deleteOne({ auctionId });
      await crawlAuctionData();
    }
  } catch (error) {
    console.error("🚀 ~ updateAuction ~ error:", error);
    throw new Error("Failed to update auction");
  }
}

export async function getAuctionDetails(req: Request) {
  try {
    const { auctionId } = req.query;

    const currentTime = Math.floor(Date.now() / 1000);

    const auction = await AuctionDataModel.findOne({
      auctionId: auctionId,
      startTime: { $lt: currentTime },
      endTime: { $gt: currentTime },
    });

    if (!auction) {
      throw new Error(
        `Auction with auctionId ${auctionId} not found or not ongoing`
      );
    }

    return auction;
  } catch (error) {
    console.error("🚀 ~ getAuctionDetails ~ error:", error);
    throw new Error("Failed to fetch auction details");
  }
}

export async function getUserListing(req: ExtendedRequest) {
  const { userVerifiedData } = req;
  const res = await AuctionDataModel.find({
    seller: userVerifiedData?.userId,
    claimed: false,
  });

  return res;
}

export async function getUserListingDetails(req: ExtendedRequest) {
  const { auctionId } = req.query;
  const { userVerifiedData } = req;

  const res = await AuctionDataModel.findOne({
    seller: userVerifiedData?.userId,
    claimed: false,
    auctionId: auctionId,
  });

  return res;
}

export async function getMakeOffer(req: ExtendedRequest) {
  const { userVerifiedData } = req;

  const res = await AuctionDataModel.find({
    highestBidder: userVerifiedData?.userId,
    claimed: false,
  });
  return res;
}

export async function getMakeOfferDetail(req: ExtendedRequest) {
  const { auctionId } = req.query;
  const { userVerifiedData } = req;

  const res = await AuctionDataModel.findOne({
    highestBidder: userVerifiedData?.userId,
    claimed: false,
    auctionId: auctionId,
  });
  return res;
}
