import { Document, model, Schema } from "mongoose";

export interface IFavorite extends Document {
  _id: string;
  userId: string;
  productId: string;
  name: string;
  color: string;
  size: number;
  price: number;
  image: string;
}

const FavoriteSchema: Schema = new Schema<IFavorite>({
  _id: { type: String, required: true },
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  name: { type: String, required: true },
  color: { type: String, required: false },
  size: { type: Number, required: false },
  price: { type: Number, required: true },
  image: { type: String, required: true },
});

export const FavoriteModel = model<IFavorite>("Favorite", FavoriteSchema);
