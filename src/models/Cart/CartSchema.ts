import { Document, model, Schema } from "mongoose";

export interface ICart extends Document {
  userId: string;
  productId: string;
  name: string;
  price: number;
  size: number;
  quantity: number;
  image: string;
}

const CartSchema: Schema = new Schema<ICart>({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: Number, required: true },
  quantity: { type: Number, required: false },
  image: { type: String, required: true },
});

export const CartModel = model<ICart>("Cart", CartSchema);
