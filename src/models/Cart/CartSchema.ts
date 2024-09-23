import { Document, model, Schema } from "mongoose";

export interface ICart extends Document {
  productId: string;
  name: string;
  price: number;
  color: string;
  size: number;
  quantity: number;
  image: string;
}

const CartSchema: Schema = new Schema<ICart>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  color: { type: String, required: true },
  size: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
});

export const CartModel = model<ICart>("Cart", CartSchema);
