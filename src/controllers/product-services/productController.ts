import { ProductModel } from "../../models/Product/ProductSchema";

export async function getAllProducts() {
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
      };
    }) || []
  );
}
