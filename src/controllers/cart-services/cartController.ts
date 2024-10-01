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
      userId: userVerifiedData?.userId,
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

export async function getCartItems(request: ExtendedRequest) {
  const { userVerifiedData } = request;
  const res = await CartModel.find({
    userId: userVerifiedData?.userId,
  });

  const totalPrice = res.reduce((sum, item) => sum + item.price, 0);

  return res.map((item) => {
    return {
      productId: item.productId,
      name: item.name,
      price: item.price,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      image: item.image,
    };
  });
}

export async function deleteCartItem(request: ExtendedRequest) {
  try {
    const { productId } = request.query;
    if (!productId) {
      throw Error("Product ID is not defined");
    }
    const deletedItem = await CartModel.findOneAndDelete({ productId });

    if (!deletedItem) {
      throw new Error(`No cart item found with product ID: ${productId}`);
    }
    return {
      success: true,
      message: "Cart item deleted successfully",
    };
  } catch (error) {
    throw error;
  }
}

export async function getCartPrice(request: ExtendedRequest) {
  const { userVerifiedData } = request;
  const res = await CartModel.find({
    userId: userVerifiedData?.userId,
  });

  const subTotal = res.reduce((sum, item) => sum + item.price, 0);
  const fee = subTotal < 200 ? 10 : 0;

  return {
    subTotal: subTotal,
    fee: fee,
    total: subTotal + fee,
  };
}
