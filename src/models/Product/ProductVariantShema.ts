import { Document, model, Schema } from "mongoose";

export type TSize = {
  size: number;
  price: number;
  stockQuantity: number;
};

export interface IProductVariant extends Document {
  variantId: number;
  productId: number;
  variantName: string;
  sizes: TSize;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductVariantSchemaL: Schema = new Schema<IProductVariant>({
  variantId: { type: Number, required: true },
  productId: { type: Number, required: true },
  variantName: { type: String, required: true },
  sizes: {
    type: {
      size: { type: Number, required: true },
      price: { type: Number, required: true },
      stockQuantity: { type: Number, required: true },
    },
  },
  color: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const ProductVariantModel = model<IProductVariant>(
  "ProductVariant",
  ProductVariantSchemaL
);
