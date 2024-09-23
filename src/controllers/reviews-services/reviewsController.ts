import { IReview, ReviewModel } from "../../models/Reviews/ReviewSchema";
import { ExtendedRequest } from "../type";
import { AuthModel, IAuthUser } from "../../models/AuthSchema";

export async function getAllReviews(request: ExtendedRequest) {
  const { productId } = request.query;
  if (!productId) {
    throw Error("Product is not defined");
  }
  const res = await ReviewModel.findOne({
    productId: productId,
  });

  let numberOfReviews = 0;
  let averageRating = 0;

  if (res?.review && Array.isArray(res.review)) {
    numberOfReviews = res.review.length;
    if (numberOfReviews > 0) {
      averageRating =
        res.review.reduce((sum, item) => sum + (item.rating || 0), 0) /
        numberOfReviews;
    }
  }

  return {
    productId: res?.productId,
    ratingAverage: averageRating,
    numberOfReviews: numberOfReviews,
    review: res?.review,
  };
}

export async function createNewReview(request: ExtendedRequest) {
  try {
    const { userVerifiedData } = request;
    const {
      comment,
      rating,
      title,
      productId,
      numberOfReviews,
      ratingAverage,
    } = request.body;

    const author: IAuthUser | null = await AuthModel.findOne({
      userId: userVerifiedData?.userId,
    });

    if (!(comment && rating && title)) {
      throw Error("Missing information");
    }

    const existingReview = await ReviewModel.findOne({
      productId: productId,
    });

    if (!author) {
      throw Error("Wrong author ID");
    }
    if (existingReview) {
      await ReviewModel.findOneAndUpdate(
        { productId: productId },
        {
          $push: {
            review: {
              userId: userVerifiedData?.userId,
              author: author.userName,
              title,
              comment,
              rating,
              createdAt: Date.now(),
            },
          },
        },
        { new: true }
      );
    } else {
      const newReview: IReview = new ReviewModel({
        productId,
        numberOfReviews,
        ratingAverage,
        review: {
          userId: userVerifiedData?.userId,
          author: author.userName,
          title,
          comment,
          rating,
          createdAt: Date.now(),
        },
      });
      await newReview.save();
    }
  } catch (error) {
    throw error;
  }
}
