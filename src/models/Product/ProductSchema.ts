import { Document, model, Schema } from "mongoose";
import { IProductVariant } from "./ProductVariantShema";

type TStatus = "available" | "soldOut";
type TGender = "Men" | "Women" | "Kids";
export interface IProduct extends Document {
  _id: string;
  name: string;
  description: string;
  status: TStatus;
  category: string;
  gender: TGender;
  createdAt: number;
  updatedAt: number;
  variants: Array<IProductVariant> | undefined;
}

const ProductSchema: Schema = new Schema<IProduct>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  category: { type: String, required: true },
  gender: { type: String, required: true },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, required: false },
  variants: { type: Array<IProductVariant>, required: true, default: [] },
});

export const ProductModel = model<IProduct>("Product", ProductSchema);
