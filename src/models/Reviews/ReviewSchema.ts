import { Document, model, Schema } from "mongoose";

export interface IReview extends Document {
  _id: string;
  productId: string;
  userId: string;
  author: string;
  title: string;
  rating: number;
  comment: string;
  createdAt: number;
}

const ReviewSchema: Schema = new Schema<IReview>({
  _id: { type: String, required: true },
  productId: { type: String, required: true },
  userId: { type: String, required: true },
  author: { type: String, required: true },
  title: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Number, default: Date.now() },
});

export const ReviewModel = model<IReview>("Review", ReviewSchema);