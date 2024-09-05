import { AuthModel, IAuthUser } from "../../models/AuthSchema";
import { hashString, verifyHash } from "../../utils/auth";
import { ExtendedRequest } from "../type";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

export async function register(req: ExtendedRequest) {
  try {
    const userId = uuidv4();
    const { password, email, firstName, lastName } = req.body;

    //Check input data
    if (!(password && email)) {
      throw Error("Missing information");
    }
    const existingUser = await AuthModel.findOne({ email: email });
    if (existingUser) {
      throw Error("Email already exists");
    }

    //create application for user
    const newUser = new AuthModel({
      userId: userId,
      password: await hashString(String(password).trim()),
      email,
      firstName,
      lastName,
      userName: `${firstName} ${lastName}`,
    });
    newUser.save();
  } catch (error) {
    throw error;
  }
}

export async function login(req: ExtendedRequest) {
  const { email, password } = req.body;
  if (!(email && password)) {
    throw Error("Missing information");
  }
  const currentUser: IAuthUser | null = await AuthModel.findOne({
    email: email,
  });

  if (!currentUser) {
    throw Error("User not exist");
  } else {
    if (await verifyHash(password, currentUser.password)) {
      var token = await jwt.sign(
        {
          userId: currentUser.userId,
        },
        process.env.SECRET_KEY || "",
        {
          expiresIn: "36500d",
        }
      );
      return token;
    } else {
      throw Error("Invalid password");
    }
  }
}

export async function getUserName(req: ExtendedRequest) {
  try {
    const { userVerifiedData } = req;
    const userProfile = await AuthModel.findOne({
      userId: userVerifiedData?.userId,
    });
    if (!userProfile) {
      throw Error("User not found");
    }
    return {
      userName: userProfile.userName,
      userId: userProfile.userId,
    };
  } catch (error) {
    throw error;
  }
}

export async function getUserProfile(req: ExtendedRequest) {
  try {
    const { userId } = req.params;
    if (!userId) {
      throw Error("Invalid user ID");
    }
    const user = await AuthModel.findOne({
      userId: userId,
    });
    if (!user) {
      throw Error("Invalid user");
    }
    const userProfile = user.toObject();
    return {
      userId: userProfile.userId,
      userName: userProfile.userName,
      email: userProfile.email,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
    };
  } catch (error) {
    throw error;
  }
}
