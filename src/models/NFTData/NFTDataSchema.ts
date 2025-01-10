import { Document, model, Schema } from "mongoose";

export interface INFTData extends Document {
  tokenId: number;
  name: string;
  description: string;
  size: number;
  owner: string;
  image: string;
}

const NFTDataSchema: Schema = new Schema<INFTData>({
  tokenId: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  size: { type: Number, required: true },
  owner: { type: String, required: true },
  image: { type: String, required: true },
});

export const NFTDataModel = model<INFTData>("NFTData", NFTDataSchema);
