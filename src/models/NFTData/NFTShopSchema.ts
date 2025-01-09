import { Document, model, Schema } from "mongoose";

export interface INFTShop extends Document {
  tokenId: number;
  name: string;
  description: string;
  price: number;
  image: string;
  sizes: number;
}

const NFTShopSchema: Schema = new Schema<INFTShop>({
  tokenId: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  sizes: { type: Number, required: true },
});

export const NFTShopModel = model<INFTShop>("NFTShop", NFTShopSchema);
