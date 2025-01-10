import { Document, model, Schema } from "mongoose";

export interface IAuctionData extends Document {
  auctionId: number;
  seller: string;
  minPrice: number;
  maxPrice: number;
  startTime: number;
  endTime: number;
  tokenId: number;
  nftContract: string;
  highBidder: string;
  highestBid: number;
  claimed: boolean;
  image: string;
  description: string;
  size: number;
  name: string;
}

const AuctionDataSchema: Schema = new Schema<IAuctionData>({
  auctionId: { type: Number, required: true },
  seller: { type: String, required: true },
  minPrice: { type: Number, required: true },
  maxPrice: { type: Number, required: true },
  startTime: { type: Number, required: true },
  endTime: { type: Number, required: true },
  tokenId: { type: Number, required: true },
  nftContract: { type: String, required: true },
  highBidder: { type: String, required: false },
  highestBid: { type: Number, required: false },
  claimed: { type: Boolean, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  size: { type: Number, required: true },
  name: { type: String, required: true },
});

export const AuctionDataModel = model<IAuctionData>(
  "AuctionData",
  AuctionDataSchema
);
