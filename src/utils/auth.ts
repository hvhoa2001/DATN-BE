import crypto from "crypto-js";
import jwt from "jsonwebtoken";

export async function verifyTokenJWT(token: string) {
  try {
    const res: any = await jwt.verify(token, process.env.SECRET_KEY || "");
    return {
      ...res,
      valid: true,
    };
  } catch (err) {
    return {
      valid: false,
    };
  }
}

export async function hashString(message: any) {
  return crypto.SHA256(message).toString(crypto.enc.Hex);
}

export async function verifyHash(message: any, hash: any) {
  const stringHash = await hashString(message);
  if (hash === stringHash) {
    return true;
  }
  return false;
}
