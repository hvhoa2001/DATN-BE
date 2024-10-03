import { Document, model, Schema } from "mongoose";

export interface ICart extends Document {
  userId: string;
  productId: string;
  variantId: string;
  sizeId: string;
  name: string;
  price: number;
  color: string;
  size: number;
  quantity: number;
  image: string;
}

const CartSchema: Schema = new Schema<ICart>({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  variantId: { type: String, required: true },
  sizeId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  color: { type: String, required: true },
  size: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
});

export const CartModel = model<ICart>("Cart", CartSchema);
