import { AuthModel, IAuthUser } from "../../models/AuthSchema";
import { CartModel, ICart } from "../../models/Cart/CartSchema";
import { ExtendedRequest } from "../type";

export async function createCartItem(request: ExtendedRequest) {
  try {
    const { userVerifiedData } = request;

    const { productId, name, price, color, size, quantity, image } =
      request.body;

    const author: IAuthUser | null = await AuthModel.findOne({
      userId: userVerifiedData?.userId,
    });

    if (!author) {
      throw Error("Wrong author ID");
    }

    if (!(name && productId && quantity && size && color)) {
      throw Error("Missing information");
    }

    const existingCart = await CartModel.findOne({
      productId: productId,
    });

    if (existingCart) {
      throw Error("Product already exists");
    }

    const newCartItem: ICart = new CartModel({
      productId,
      name,
      price,
      color,
      size,
      quantity,
      image,
    });
    await newCartItem.save();
    return { productId, name, quantity, size, color };
  } catch (error) {
    throw error;
  }
}
