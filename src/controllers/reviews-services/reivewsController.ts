import { IReview, ReviewModel } from "../../models/Reviews/ReviewSchema";
import { ExtendedRequest } from "../type";
import { v4 as uuidv4 } from "uuid";
import { getUserName } from "../user-services/userController";

export async function getAllReviews(request: ExtendedRequest) {
  const { productVerifiedData } = request;
  const res = await ReviewModel.find({
    productId: productVerifiedData?.productId,
  });
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
        createdAt: item.createdAt,
      };
    }) || []
  );
}

export async function createNewReview(request: ExtendedRequest) {
  try {
    const { productId } = request.query;
    const { comment, rating, title, userId, createdAt } = request.body;

    const author = await getUserName(userId);

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
      userId: userId,
      productId: productId,
      author: author.userName,
      createdAt,
    });
    await newReview.save();
  } catch (error) {
    throw error;
  }
}
