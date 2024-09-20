import { Document, model, Schema } from "mongoose";

export interface IReview extends Document {
  _id: string;
  productId: string;
  numberOfReviews: number;
  userId: string;
  author: string;
  title: string;
  rating: number;
  ratingAverage: number;
  comment: string;
  createdAt: number;
}

const ReviewSchema: Schema = new Schema<IReview>({
  _id: { type: String, required: true },
  productId: { type: String, required: true },
  numberOfReviews: { type: Number, required: true },
  userId: { type: String, required: true },
  author: { type: String, required: true },
  title: { type: String, required: true },
  rating: { type: Number, required: true },
  ratingAverage: { type: Number, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Number, default: Date.now() },
});

export const ReviewModel = model<IReview>("Review", ReviewSchema);
