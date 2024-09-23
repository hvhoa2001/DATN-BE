import { Document, model, Schema } from "mongoose";

export type TReview = {
  _id: string;
  userId: string;
  author: string;
  title: string;
  rating: number;
  comment: string;
  createdAt: number;
};

export interface IReview extends Document {
  productId: string;
  numberOfReviews: number;
  ratingAverage: number;
  review: Array<TReview>;
}

const ReviewSchema: Schema = new Schema<IReview>({
  productId: { type: String, required: true },
  numberOfReviews: { type: Number, required: false },
  ratingAverage: { type: Number, required: false },
  review: [{ type: Schema.Types.Mixed, required: true }],
});

export const ReviewModel = model<IReview>("Review", ReviewSchema);
