import { Document, model, Schema } from "mongoose";

export type TSize = {
  size: number;
  price: number;
  stockQuantity: number;
};

export interface IProductVariant extends Document {
  _id: number;
  productId: string;
  sizes: TSize;
  color: string;
  image: Array<string> | undefined;
}

const ProductVariantSchemaL: Schema = new Schema<IProductVariant>({
  _id: { type: Number, required: true },
  productId: { type: String, required: true },
  sizes: { type: Schema.Types.Mixed, required: true },
  color: { type: String, required: true },
  image: { type: Array, required: true, default: [] },
});

export const ProductVariantModel = model<IProductVariant>(
  "ProductVariant",
  ProductVariantSchemaL
);
