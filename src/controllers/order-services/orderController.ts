import { AuthModel, IAuthUser } from "../../models/AuthSchema";
import { IOrders, OrderModel } from "../../models/Order/OrderSchema";
import { ExtendedRequest } from "../type";
import { v4 as uuidv4 } from "uuid";

export async function createNewOrder(request: ExtendedRequest) {
  try {
    const { userVerifiedData, orderVerifiedData } = request;
    const { address, paymentMethod, totalAmount, status, userName } =
      request.body;

    const author: IAuthUser | null = await AuthModel.findOne({
      userId: userVerifiedData?.userId,
    });

    if (!author) {
      throw Error("Wrong author ID");
    }

    const existingOrder = await OrderModel.findOne({
      _id: orderVerifiedData?.orderId,
    });
    if (existingOrder) {
      throw Error("Product already exists");
    }

    const orderId = uuidv4();
    const newOrder: IOrders = new OrderModel({
      _id: orderId,
      userId: userVerifiedData?.userId,
      userName,
      orderDate: Date.now(),
      totalAmount,
      status,
      shippingAddress: address,
      paymentMethod: paymentMethod,
    });
    await newOrder.save();
    return {
      orderId,
      userName,
      address,
      paymentMethod,
      totalAmount,
      status,
    };
  } catch (error) {
    throw error;
  }
}

export async function getOrders(request: ExtendedRequest) {
  try {
    const { userVerifiedData } = request;
    const res = await OrderModel.find({
      userId: userVerifiedData?.userId,
    });
    return res.map((item) => {
      return {
        orderId: item._id,
        orderDate: item.orderDate,
        userName: item.userName,
        status: item.status,
        totalAmount: item.totalAmount,
        shippingAddress: item.shippingAddress,
        paymentMethod: item.paymentMethod,
      };
    });
  } catch (error) {
    throw error;
  }
}
