import { Document, model, Schema } from "mongoose";

export enum Role {
  ADMIN = "admin",
  USER = "user",
}

export interface IAuthUser extends Document {
  userName?: string;
  email?: string;
  userId: string;
  // password: string;
  firstName?: string;
  lastName?: string;
  address: string;
  role: Role;
}

const AuthSchema: Schema = new Schema<IAuthUser>({
  userName: { type: String, required: false },
  email: { type: String, required: false },
  userId: { type: String, required: true },
  address: { type: String, required: true, unique: true },
  // password: { type: String, required: false },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  role: { type: String, required: true, default: Role.USER },
});

export const AuthModel = model<IAuthUser>("AuthUser", AuthSchema);
