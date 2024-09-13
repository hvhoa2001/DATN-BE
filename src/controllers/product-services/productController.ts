import { Request } from "express";
import { IProduct, ProductModel } from "../../models/Product/ProductSchema";
import { ExtendedRequest } from "../type";
import { AuthModel, IAuthUser } from "../../models/AuthSchema";
import { v4 as uuidv4 } from "uuid";

export async function getAllProducts(req: Request) {
  const res = await ProductModel.find();
  return (
    res.map((item) => {
      return {
        productId: item._id,
        name: item.name,
        description: item.description,
        variants: item.variants,
        status: item.status,
        image: item.image,
        category: item.category,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        price: item.price,
        highlight: item.highlight,
      };
    }) || []
  );
}

export async function createNewProduct(request: ExtendedRequest) {
  try {
    const { userVerifiedData } = request;
    const {
      name,
      description,
      variants,
      status,
      image,
      category,
      createdAt,
      price,
      highlight,
    } = request.body;

    if (!(name && variants && status && image && category)) {
      throw Error("Missing information");
    }
    const author: IAuthUser | null = await AuthModel.findOne({
      userId: userVerifiedData?.userId,
    });

    if (!author) {
      throw Error("Wrong author ID");
    }
    const productId = uuidv4();

    const newProduct: IProduct = new ProductModel({
      _id: productId,
      name: String(name).slice(0, 100),
      description: String(description).slice(0, 1000),
      price,
      highlight,
      variants,
      status,
      image,
      category,
      createdAt,
      updatedAt: new Date(),
    });
    await newProduct.save();
    return productId;
  } catch (error) {
    throw error;
  }
}
