import { Request } from "express";
import { IProduct, ProductModel } from "../../models/Product/ProductSchema";
import { ExtendedRequest } from "../type";
import { AuthModel, IAuthUser } from "../../models/AuthSchema";
import { v4 as uuidv4 } from "uuid";
import {
  IProductVariant,
  ProductVariantModel,
} from "../../models/Product/ProductVariantShema";
import { ISize, SizeModel } from "../../models/Product/SizeSchema";

export async function getAllProducts(req: Request) {
  const res = await ProductModel.find();
  return (
    res.map((item) => {
      return {
        productId: item._id,
        name: item.name,
        description: item.description,
        status: item.status,
        category: item.category,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        variant: item.variants,
      };
    }) || []
  );
}

export async function getProductDetail(req: ExtendedRequest) {
  try {
    const { productId } = req.query;
    const productDetail = await ProductVariantModel.findOne({
      productId: productId,
    });
    if (!productDetail) {
      throw Error("Product not found");
    }

    // const calculateTotalStockQuantity = (product: IProduct): number => {
    //   return product.variants.reduce((total, variant) => {
    //     return (
    //       total +
    //       variant.sizes.reduce(
    //         (sizeTotal, size) => sizeTotal + size.stockQuantity,
    //         0
    //       )
    //     );
    //   }, 0);
    // };
    // const totalStockQuantity = calculateTotalStockQuantity(productDetail);

    return {
      productId: productId,
      sizes: productDetail.sizes,
      color: productDetail.color,
      preview: productDetail.preview,
      image: productDetail.image,
      madeIn: productDetail.madeIn,
      fullPrice: productDetail.fullPrice,
      currentPrice: productDetail.currentPrice,
      saleRate: productDetail.saleRate,
      isOnSale: productDetail.isOnSale,
      highlight: productDetail.highlight,
      style: productDetail.style,
    };
  } catch (error) {
    throw error;
  }
}

export async function createNewProduct(request: ExtendedRequest) {
  try {
    const { userVerifiedData, productVerifiedData } = request;
    const { name, description, status, category, createdAt, gender } =
      request.body;

    if (!(name && status && category)) {
      throw Error("Missing information");
    }
    const author: IAuthUser | null = await AuthModel.findOne({
      userId: userVerifiedData?.userId,
    });

    const existingProduct = await ProductModel.findOne({
      _id: productVerifiedData?.productId,
    });
    if (existingProduct) {
      throw Error("Product already exists");
    }

    if (!author) {
      throw Error("Wrong author ID");
    }
    const productId = uuidv4();

    const newProduct: IProduct = new ProductModel({
      _id: productId,
      name: String(name).slice(0, 100),
      description: String(description).slice(0, 1000),
      status,
      gender,
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

export async function createVariant(request: ExtendedRequest) {
  try {
    const { userVerifiedData } = request;
    const { productId } = request.params;
    const {
      image,
      highlight,
      style,
      madeIn,
      color,
      preview,
      isOnSale,
      saleRate,
      fullPrice,
      currentPrice,
    } = request.body;

    const author: IAuthUser | null = await AuthModel.findOne({
      userId: userVerifiedData?.userId,
    });

    if (!author) {
      throw Error("Wrong author ID");
    }

    if (!(color && preview && image && madeIn && style && fullPrice)) {
      throw Error("Missing information");
    }

    const existingProduct = await ProductVariantModel.findOne({
      productId: productId,
      color: color,
    });
    if (existingProduct) {
      throw Error("Product already exists");
    }
    const variantId = uuidv4();

    const newVariant: IProductVariant = new ProductVariantModel({
      _id: variantId,
      productId: productId,
      color,
      preview,
      image,
      madeIn,
      fullPrice,
      currentPrice: fullPrice * (1 - saleRate),
      saleRate,
      isOnSale,
      highlight,
      style,
    });
    await newVariant.save();
    return { variantId, productId, currentPrice, color };
  } catch (error) {
    throw error;
  }
}

export async function createSize(request: ExtendedRequest) {
  try {
    const { userVerifiedData } = request;
    const { variantId } = request.params;
    const { size, stockQuantity } = request.body;

    const author: IAuthUser | null = await AuthModel.findOne({
      userId: userVerifiedData?.userId,
    });

    if (!author) {
      throw Error("Wrong author ID");
    }

    if (!size) {
      throw Error("Missing information");
    }

    const existingVariant = await SizeModel.findOne({
      variantId: variantId,
      size: size,
    });

    if (existingVariant) {
      throw Error("Size already exists");
    }

    const variants: IProductVariant | null = await ProductVariantModel.findById(
      variantId
    );

    if (!variants) {
      throw Error("Variant not found");
    }

    const existingSize = variants.sizes?.find(
      (existingSize) => existingSize.size === size
    );

    if (existingSize) {
      throw Error("Variant not found");
    }

    const sizeId = uuidv4();
    const newSize: ISize = new SizeModel({
      _id: sizeId,
      variantId,
      size,
      stockQuantity,
    });
    variants.sizes?.push(newSize);
    await variants.save();
    return sizeId;
  } catch (error) {
    throw error;
  }
}
