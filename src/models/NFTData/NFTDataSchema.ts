import { Document, model, Schema } from "mongoose";

export interface INFTData extends Document {
  _id: string;
  tokenId: number;
  name: string;
  description: string;
  price: number;
  sizes: { size: number; quantity: number; active: boolean };
}

const NFTDataSchema: Schema = new Schema<INFTData>({
  _id: { type: String, required: true },
  tokenId: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  sizes: {
    size: { type: Number, required: true },
    quantity: { type: Number, required: true },
    active: { type: Boolean, required: true },
  },
});

export const NFTDataModel = model<INFTData>("NFTData", NFTDataSchema);
