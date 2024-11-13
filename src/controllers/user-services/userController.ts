import { AuthModel, IAuthUser } from "../../models/AuthSchema";
// import { hashString, verifyHash } from "../../utils/auth";
import { ExtendedRequest } from "../type";
// import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { ethers } from "ethers";

// export async function register(req: ExtendedRequest) {
//   try {
//     const userId = uuidv4();
//     const { password, email, firstName, lastName } = req.body;

//     //Check input data
//     if (!(password && email)) {
//       throw Error("Missing information");
//     }
//     const existingUser = await AuthModel.findOne({ email: email });
//     if (existingUser) {
//       throw Error("Email already exists");
//     }

//     //create application for user
//     const newUser = new AuthModel({
//       userId: userId,
//       password: await hashString(String(password).trim()),
//       email,
//       firstName,
//       lastName,
//       userName: `${firstName} ${lastName}`,
//     });
//     newUser.save();
//   } catch (error) {
//     throw error;
//   }
// }

// export async function login(req: ExtendedRequest) {
//   const { email, password } = req.body;
//   if (!(email && password)) {
//     throw Error("Missing information");
//   }
//   const currentUser: IAuthUser | null = await AuthModel.findOne({
//     email: email,
//   });

//   if (!currentUser) {
//     throw Error("User not exist");
//   } else {
//     if (await verifyHash(password, currentUser.password)) {
//       var token = await jwt.sign(
//         {
//           userId: currentUser.userId,
//           role: currentUser.role,
//         },
//         process.env.SECRET_KEY || "",
//         {
//           expiresIn: "36500d",
//         }
//       );
//       return { token, role: currentUser.role };
//     } else {
//       throw Error("Invalid password");
//     }
//   }
// }

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
      userEmail: userProfile.email,
      userName: userProfile.userName,
      userId: userProfile.userId,
      role: userProfile.role,
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

export async function checkEmail(req: ExtendedRequest) {
  try {
    const { email } = req.query;
    if (!email) {
      return false;
    }
    const existedEmail = await AuthModel.findOne({
      email: email,
    });
    if (existedEmail) {
      return false;
    }
    return true;
  } catch (error) {
    throw error;
  }
}

export async function updateRole(req: ExtendedRequest) {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    if (!userId && !role) {
      throw Error("Missing information");
    }

    const user = await AuthModel.findOne({
      userId: userId,
    });
    if (!user) {
      throw Error("Invalid user");
    }
    user.role = role;
    await user.save();
    return { user: user.email, role: user.role };
  } catch (error) {
    throw error;
  }
}

function generateToken(user: IAuthUser): string {
  return jwt.sign(
    {
      userId: user.userId,
      role: user.role,
    },
    process.env.SECRET_KEY || "",
    { expiresIn: "36500d" }
  );
}

export async function googleCallback(req: ExtendedRequest) {
  try {
    const user = req.user as IAuthUser;

    if (!user) {
      throw Error("Invalid user");
    }
    const token = generateToken(user);
    return { jwt: token, role: user.role };
  } catch (error) {
    throw error;
  }
}

export async function LoginWallet(req: ExtendedRequest) {
  const { address, nonce, signature } = req.body;
  const user = req.user as IAuthUser;

  if (!(address && nonce && signature)) {
    throw Error("Missing information");
  }

  const recoveredAddress = ethers.utils.recoverAddress(nonce, signature);
  if (recoveredAddress !== address) {
    throw Error("Invalid signature");
  }
  const token = generateToken(user);
  return { jwt: token, role: user.role };
}
