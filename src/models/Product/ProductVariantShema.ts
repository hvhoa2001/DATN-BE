import { Document, model, Schema } from "mongoose";
import { ISize } from "./SizeSchema";
export interface IProductVariant extends Document {
  _id: string;
  productId: string;
  color: string;
  preview: string;
  image: Array<string> | undefined;
  sizes: Array<ISize> | undefined;
  madeIn: Array<string> | undefined;
  fullPrice: number;
  currentPrice: number;
  saleRate: number;
  isOnSale: boolean;
  highlight: string;
  style: string;
}

const ProductVariantSchema: Schema = new Schema<IProductVariant>({
  _id: { type: String, required: true },
  productId: { type: String, required: true },
  sizes: { type: Array<ISize>, required: true, default: [] },
  color: { type: String, required: true },
  image: { type: Array, required: true, default: [] },
  preview: { type: String, required: true },
  madeIn: { type: Array<String>, required: true },
  isOnSale: { type: Boolean, required: true },
  highlight: { type: String, required: true },
  style: { type: String, required: true },
  fullPrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  saleRate: { type: Number, required: true, default: 0 },
});

export const ProductVariantModel = model<IProductVariant>(
  "ProductVariant",
  ProductVariantSchema
);
