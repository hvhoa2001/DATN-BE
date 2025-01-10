import { AuthModel, IAuthUser } from "../../models/AuthSchema";
import { CartModel, ICart } from "../../models/Cart/CartSchema";
import { NFTShopModel } from "../../models/NFTData/NFTShopSchema";
import { SizeModel } from "../../models/Product/SizeSchema";
import { ExtendedRequest } from "../type";

export async function createCartItem(request: ExtendedRequest) {
  try {
    const { userVerifiedData } = request;

    const { productId, name, price, size, image, quantity } = request.body;

    const author: IAuthUser | null = await AuthModel.findOne({
      userId: userVerifiedData?.userId,
    });

    if (!author) {
      throw Error("Wrong author ID");
    }

    if (!(name && productId && size)) {
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
      size,
      image,
      quantity,
    });
    await newCartItem.save();
    return { productId, name, size };
  } catch (error) {
    throw error;
  }
}

export async function getCartItems(request: ExtendedRequest) {
  const { userVerifiedData } = request;
  const res = await CartModel.find({
    userId: userVerifiedData?.userId,
  });

  return res.map((item) => {
    return {
      productId: item.productId,
      name: item.name,
      price: item.price,
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

export async function getCheckout(request: ExtendedRequest) {
  try {
    const { userVerifiedData } = request;
    const cartItems = await CartModel.find({
      userId: userVerifiedData?.userId,
    });
    let newCartItem = [];
    for (const item of cartItems) {
      const size = await NFTShopModel.findOne({
        name: item.name,
        sizes: item.size,
      });
      if (size) {
        newCartItem.push(item);
      }
    }
    return newCartItem;
  } catch (error) {
    throw error;
  }
}

export async function getItemToBuy(request: ExtendedRequest) {
  try {
    const { name, size } = request.query;
    const products = await NFTShopModel.findOne({
      name: name,
      sizes: size,
    });
    return products;
  } catch (error) {
    console.log("🚀 ~ getItemToBuy ~ error:", error);
    throw error;
  }
}
