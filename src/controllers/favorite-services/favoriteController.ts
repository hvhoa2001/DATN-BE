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
        name: item.name,
        color: item.color,
        size: item.size,
        price: item.price,
        image: item.image,
      };
    }) || []
  );
}

export async function createNewFavorite(request: ExtendedRequest) {
  try {
    const { userVerifiedData, productVerifiedData, favoriteVerifiedData } =
      request;
    const { name, color, size, price, image } = request.body;

    const author: IAuthUser | null = await AuthModel.findOne({
      userId: userVerifiedData?.userId,
    });

    if (!(name && color && size && price && image)) {
      throw Error("Missing information");
    }

    const existingFavorite = await FavoriteModel.findOne({
      _id: favoriteVerifiedData?.favoriteId,
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
      productId: productVerifiedData?.productId,
      name,
      color,
      size,
      price,
      image,
    });
    await newFavorite.save();
    return { favoriteId };
  } catch (error) {
    throw error;
  }
}
