import { AuthModel, IAuthUser } from "../../models/AuthSchema";
import { CartModel, ICart } from "../../models/Cart/CartSchema";
import { SizeModel } from "../../models/Product/SizeSchema";
import { ExtendedRequest } from "../type";

export async function createCartItem(request: ExtendedRequest) {
  try {
    const { userVerifiedData } = request;

    const {
      productId,
      name,
      price,
      color,
      size,
      quantity,
      image,
      variantId,
      sizeId,
    } = request.body;

    const author: IAuthUser | null = await AuthModel.findOne({
      userId: userVerifiedData?.userId,
    });

    if (!author) {
      throw Error("Wrong author ID");
    }

    if (
      !(name && productId && quantity && size && color && sizeId && variantId)
    ) {
      throw Error("Missing information");
    }

    const existingCart = await CartModel.findOne({
      productId: productId,
      variantId: variantId,
    });

    if (existingCart) {
      throw Error("Product already exists");
    }

    const newCartItem: ICart = new CartModel({
      userId: userVerifiedData?.userId,
      productId,
      variantId,
      sizeId,
      name,
      price,
      color,
      size,
      quantity,
      image,
    });
    await newCartItem.save();
    return { productId, name, quantity, size, color, variantId };
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
      variantId: item.variantId,
      sizeId: item.sizeId,
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

export async function checkQuantity(request: ExtendedRequest) {
  try {
    const { variantId, sizeId } = request.query;
    const size = await SizeModel.findOne({
      _id: sizeId,
      variantId: variantId,
    });
    const cartItem = await CartModel.findOne({
      variantId: variantId,
      sizeId: sizeId,
    });
    if (
      size?.stockQuantity &&
      cartItem?.quantity &&
      size?.stockQuantity < cartItem?.quantity
    ) {
      return false;
    }
    // throw new Error("Insufficient stock quantity");
    return true;
  } catch (error) {
    throw error;
  }
}

// export async function getCartPrice(request: ExtendedRequest) {
//   const { userVerifiedData } = request;
//   const res = await CartModel.find({
//     userId: userVerifiedData?.userId,
//   });

//   const subTotal = res.reduce((sum, item) => sum + item.price, 0);
//   const fee = subTotal < 200 ? 10 : 0;

//   return {
//     subTotal: subTotal,
//     fee: fee,
//     total: subTotal + fee,
//   };
// }

export async function getCartPrice(request: ExtendedRequest) {
  const { userVerifiedData } = request;

  const cartItems = await CartModel.find({
    userId: userVerifiedData?.userId,
  });
  console.log("🚀 ~ getCartPrice ~ cartItems:", cartItems);

  let subTotal = 0;

  for (const item of cartItems) {
    const size = await SizeModel.findOne({
      _id: item.sizeId,
      variantId: item.variantId,
    });

    console.log("size", size);

    if (size?.stockQuantity && size.stockQuantity >= item.quantity) {
      subTotal += item.price * item.quantity;
    }
  }

  const fee = subTotal < 200 ? 10 : 0;

  return {
    subTotal: subTotal,
    fee: fee,
    total: subTotal + fee,
  };
}
