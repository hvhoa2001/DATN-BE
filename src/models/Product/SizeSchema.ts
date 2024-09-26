import { Document, model, Schema } from "mongoose";

export interface ISize extends Document {
  _id: string;
  variantId: string;
  size: number;
  stockQuantity: number;
}

const SizeSchema: Schema = new Schema<ISize>({
  _id: { type: String, required: true },
  variantId: { type: String, required: true },
  size: { type: Number, required: true },
  stockQuantity: { type: Number, required: true },
});

export const SizeModel = model<ISize>("Size", SizeSchema);
