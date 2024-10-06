import { Document, model, Schema } from "mongoose";

type StatusOrder = "In process" | "Delivered" | "Completed" | "Cancelled";
type PaymentMethod = "NFTs" | "Credit Card";
export interface IOrders extends Document {
  _id: string;
  userId: string;
  userName: string;
  orderDate: number;
  totalAmount: number;
  status: StatusOrder;
  shippingAddress: string;
  paymentMethod: PaymentMethod;
}

const OrderSchema: Schema = new Schema<IOrders>({
  _id: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  orderDate: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, required: true, default: "In process" },
  shippingAddress: { type: String, required: true },
  paymentMethod: { type: String, required: true },
});

export const OrderModel = model<IOrders>("Order", OrderSchema);
