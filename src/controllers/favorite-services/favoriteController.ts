import { AuthModel, IAuthUser } from "../../models/AuthSchema";
import { FavoriteModel, IFavorite } from "../../models/Favorite/FavoriteSchema";
import { ExtendedRequest } from "../type";
import { v4 as uuidv4 } from "uuid";

export async function getAllFavorites(request: ExtendedRequest) {
  const { userVerifiedData } = request;
  const res = await FavoriteModel.find({
    userId: userVerifiedData?.userId,
  });
  return (
    res.map((item) => {
      return {
        productId: item.productId,
        name: item.name,
        // color: item.color,
        // size: item.size,
        price: item.price,
        image: item.image,
      };
    }) || []
  );
}

export async function createNewFavorite(request: ExtendedRequest) {
  try {
    const { userVerifiedData } = request;
    const { name, price, image, productId } = request.body;

    const author: IAuthUser | null = await AuthModel.findOne({
      userId: userVerifiedData?.userId,
    });

    if (!(name && price && image)) {
      throw Error("Missing information");
    }

    const existingFavorite = await FavoriteModel.findOne({
      productId: productId,
    });

    if (existingFavorite) {
      throw Error("Product already exists");
    }

    if (!author) {
      throw Error("Wrong author ID");
    }
    const favoriteId = uuidv4();

    const newFavorite: IFavorite = new FavoriteModel({
      _id: favoriteId,
      userId: userVerifiedData?.userId,
      productId,
      name,
      price,
      image,
    });
    await newFavorite.save();
    return { favoriteId, name, price, image, productId };
  } catch (error) {
    throw error;
  }
}

export async function deleteFavoriteItem(request: ExtendedRequest) {
  try {
    const { productId } = request.query;
    if (!productId) {
      throw Error("Product is not defined");
    }
    const deletedItem = await FavoriteModel.findOneAndDelete({ productId });

    if (!deletedItem) {
      throw new Error(`No favorite item found with product ID: ${productId}`);
    }

    return {
      success: true,
      message: "Favorite item deleted successfully",
    };
  } catch (error) {
    throw error;
  }
}
