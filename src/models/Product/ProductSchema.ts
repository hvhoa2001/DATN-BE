import { Document, model, Schema } from "mongoose";

export type TSize = {
  size: number;
  price: number;
  stockQuantity: number;
};

export type TVariants = {
  _id: string;
  color: string;
  image: Array<string> | undefined;
  sizes: TSize;
};

export interface IProduct extends Document {
  _id: string;
  name: string;
  description: string;
  variants: TVariants;
  status: string;
  price: number;
  highlight: string;
  image: Array<string> | undefined;
  category: string;
  style: string;
  madeIn: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema<IProduct>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  variants: { type: Schema.Types.Mixed, required: true },
  status: { type: String, required: true },
  price: { type: Number, required: true },
  highlight: { type: String, required: false },
  image: { type: Array<String>, required: true, default: [] },
  category: { type: String, required: true },
  style: { type: String, required: true },
  madeIn: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, required: false },
});

export const ProductModel = model<IProduct>("Product", ProductSchema);
