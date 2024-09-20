import { IReview, ReviewModel } from "../../models/Reviews/ReviewSchema";
import { ExtendedRequest } from "../type";
import { v4 as uuidv4 } from "uuid";
import { AuthModel, IAuthUser } from "../../models/AuthSchema";

export async function getAllReviews(request: ExtendedRequest) {
  const { productId } = request.query;
  if (!productId) {
    throw Error("Product is not defined");
  }
  const res = await ReviewModel.find({
    productId: productId,
  });

  const averageRating =
    res.reduce((sum, item) => sum + item.rating, 0) / res.length;

  return (
    res.map((item) => {
      return {
        reviewId: item._id,
        productId: item.productId,
        userId: item.userId,
        title: item.title,
        author: item.author,
        comment: item.comment,
        rating: item.rating,
        ratingAverage: averageRating,
        numberOfReviews: res.length,
        createdAt: item.createdAt,
      };
    }) || []
  );
}

export async function createNewReview(request: ExtendedRequest) {
  try {
    const { userVerifiedData } = request;

    const { comment, rating, title, productId, createdAt } = request.body;

    const author: IAuthUser | null = await AuthModel.findOne({
      userId: userVerifiedData?.userId,
    });

    if (!(comment && rating && title)) {
      throw Error("Missing information");
    }

    const existingReview = await ReviewModel.findOne({
      productId: productId,
    });

    if (existingReview) {
      throw Error("Review already exists");
    }

    if (!author) {
      throw Error("Wrong author ID");
    }

    const reviewId = uuidv4();
    const newReview: IReview = new ReviewModel({
      _id: reviewId,
      title: String(title).slice(0, 100),
      comment: String(comment).slice(0, 1000),
      rating: rating,
      userId: userVerifiedData?.userId,
      productId,
      author: author.userName,
      createdAt,
    });
    await newReview.save();
  } catch (error) {
    throw error;
  }
}
