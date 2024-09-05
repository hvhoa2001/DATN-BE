import { Document, model, Schema } from "mongoose";

export interface IAuthUser extends Document {
  userName: string;
  email: string;
  userId: string;
  password: string;
  firstName: string;
  lastName: string;
}

const AuthSchema: Schema = new Schema<IAuthUser>({
  userName: { type: String, required: false },
  email: { type: String, required: true },
  userId: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

export const AuthModel = model<IAuthUser>("AuthUser", AuthSchema);
